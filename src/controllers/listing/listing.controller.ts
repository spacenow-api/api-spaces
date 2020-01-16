import { Router, Request, Response, NextFunction } from "express";
import { subDays, format } from "date-fns";
import axios from "axios";
import Sequelize from "sequelize";
import NodeCache from "node-cache";

import * as config from "../../config";

import {
  authMiddleware,
  authAdminMiddleware
} from "../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../helpers/exceptions/HttpException";

import { _getCategories } from "./../categories/category.controller";

import {
  Listing,
  ListingData,
  Location,
  ListingAccessDays,
  ListingAmenities,
  ListingAccessHours,
  ListingRules,
  ListingPhotos,
  ListSettings,
  ListSettingsParent,
  UserProfile
} from "../../models";

import {
  IDraftRequest,
  IUpdateRequest,
  IAccessDaysRequest
} from "../../interfaces/listing.interface";

const Op = Sequelize.Op;
const Fn = Sequelize.fn;
const Col = Sequelize.col;

const cacheKeys = {
  PLAIN_LIST: "_listings_plain_",
  BY_USER: "_listings_by_user_",
  COUNT_ALL: "_listings_count_"
};

class ListingController {
  private router = Router();

  // Standard expiration time for 3 days...
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.router.get(`/listings`, this.getAllPlainListings);
    this.router.get(`/listings/:id`, authMiddleware, this.getListingById);
    this.router.get(
      `/listings/user/:userId`,
      authMiddleware,
      this.getAllListingsByUser
    );
    this.router.get(`/listings/public/:id`, this.getListingById);
    this.router.get(`/listings/count/all`, authMiddleware, this.getAllListings);
    this.router.get(`/listings/count/hosts`, authMiddleware, this.getAllHosts);
    this.router.get(
      `/listings/count/hosts/date`,
      authMiddleware,
      this.getAllHostsByDate
    );
    this.router.get(
      `/listings/count/date`,
      authMiddleware,
      this.getAllListingsByDate
    );
    this.router.get(
      `/listings/count/categories`,
      authMiddleware,
      this.getListingsCountCategories
    );
    this.router.get(`/listings/data/:listingId`, this.getListingDataById);
    this.router.get(`/listings/fetch/accesstypes`, this.fetchAccessTypes);
    this.router.get(
      "/listings/public/mulitple/ids",
      this.getPublicListingsByIds
    );
    this.router.put("/listings/update", authMiddleware, this.updateListing);
    this.router.put(
      "/listings/:listingId/status/:status",
      authAdminMiddleware,
      this.putChangeListingStatus
    );
    this.router.put(
      "/listings/:listingId/publish/:status",
      authMiddleware,
      this.publishListing
    );
    this.router.put("/listings/claim/:listingId", this.claimListing);
    this.router.post(
      "/listings/draft",
      authMiddleware,
      this.createDraftListing
    );
    this.router.delete(
      "/listings/:listingId",
      authMiddleware,
      this.deleteListing
    );
  }

  createDraftListing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data: IDraftRequest = req.body;
    try {
      if (!data.locationId)
        throw new HttpException(400, "A location must be provided.");
      const locationObj: Location | null = await Location.findOne({
        where: { id: data.locationId }
      });
      if (!locationObj)
        throw new HttpException(400, "A location must be provided.");
      // Creating listing record...
      const listingObj: Listing = await Listing.create({
        userId: req.userIdDecoded,
        locationId: data.locationId,
        listSettingsParentId: data.listSettingsParentId,
        bookingPeriod: data.bookingPeriod,
        title: data.title,
        coverPhotoId: data.coverPhotoId,
        quantity: data.quantity
      });
      // Creating listing-data record...
      await ListingData.findOrCreate({
        where: { listingId: listingObj.id }
      });
      // Creating access-days record...
      const [accessDaysCreated, _] = await ListingAccessDays.findOrCreate({
        where: { listingId: listingObj.id }
      });
      await this.fillDefaultTimeTable(accessDaysCreated);
      res.send(listingObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  /**
   * Get listing by ID.
   */
  getListingById = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <number>(<unknown>req.params.id);
    try {
      const where: { id: number;[key: string]: any } = { id: listingId };
      const { isPublished } = req.query;
      if (isPublished) {
        where.isPublished = isPublished === "true";
      }
      const listingObj: Listing | null = await Listing.findOne({ where });
      if (!listingObj) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      res.send(listingObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  /**
   * Get listings.
   */
  getAllPlainListings = async (req: Request, res: Response, next: NextFunction) => {
    let page = 0;
    let pageSize = 10;
    try {
      const q = req.query;
      if (q) {
        page = q.page ? parseInt(q.page, 10) : 0;
        pageSize = q.limit ? parseInt(q.limit, 10) : 10;
      }
      const cacheKey = `${cacheKeys.PLAIN_LIST}page_${page}_size_${pageSize}_`;
      const cacheData = this.cache.get(cacheKey);
      if (cacheData) {
        res.send(cacheData);
        return;
      }
      const result = await Listing.findAndCountAll({ limit: pageSize, offset: page * pageSize });
      this.cache.set(cacheKey, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  /**
   * Get listing by ID.
   */
  getAllListingsByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = <string>(<unknown>req.params.userId);
    const status = "deleted";
    try {
      const cacheData = this.cache.get(`${cacheKeys.BY_USER}${userId}`);
      if (cacheData) {
        res.send(cacheData);
        return;
      }
      const where: { userId: string; status: any;[key: string]: any } = {
        userId,
        status: { [Op.not]: status }
      };
      const results: {
        rows: Listing[];
        count: number;
      } | null = await Listing.findAndCountAll({
        where,
        order: [["updatedAt", "DESC"]]
      });
      this.cache.set(
        `${cacheKeys.BY_USER}${userId}`,
        JSON.parse(JSON.stringify(results))
      );
      res.send(results);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  claimListing = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.listingId;
    try {
      this.cache.flushAll();
      if (!listingId)
        throw new HttpException(400, "A Listing must be provided.");
      const listingObj: Listing | null = await Listing.findOne({
        where: { id: listingId }
      });
      if (!listingObj)
        throw new HttpException(400, "A Listgin must be provided.");
      // Updating listing record...
      await Listing.update({ status: "claimed" }, { where: { id: listingId } });
      res.send(listingObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  publishListing = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.listingId;
    try {
      this.cache.flushAll();
      const listingObj: Listing | null = await Listing.findOne({
        where: { id: listingId }
      });
      if (!listingObj) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      const isToPublished: Boolean = /true/i.test(req.params.status);
      if (isToPublished) {
        const isReadyConditional = await this.isReady(listingObj);
        await Listing.update(
          { isPublished: isReadyConditional },
          { where: { id: listingId }, individualHooks: true }
        );
        if (!isReadyConditional) {
          throw new HttpException(
            400,
            `Listing ${listingId} is not ready to publish.`
          );
        }
      } else {
        await Listing.update(
          { isPublished: false },
          { where: { id: listingId }, individualHooks: true }
        );
      }
      const listingUpdated = await Listing.findOne({
        where: { id: listingId }
      });
      res.send(listingUpdated);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.cache.flushAll();
      const listingId = req.params.listingId;
      const listingObj = await Listing.findOne({ where: { id: listingId } });
      if (!listingObj) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      this.onlyOwner(req, listingObj);
      await Listing.update(
        { status: "deleted", isPublished: false },
        { where: { id: listingId } }
      );
      res.send({ status: "OK" });
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  updateListing = async (req: Request, res: Response, next: NextFunction) => {
    const data: IUpdateRequest = req.body;
    try {
      this.cache.flushAll();
      // Getting listing record...
      const listingObj: Listing | null = await Listing.findOne({
        where: { id: data.listingId }
      });
      if (!listingObj)
        throw new HttpException(400, `Listing ${data.listingId} not found.`);
      // User Validation...
      this.onlyOwner(req, listingObj);
      // Updating isReady rule...
      let accessDaysToValidate: any = data.listingAccessDays;
      if (!accessDaysToValidate) {
        accessDaysToValidate = await ListingAccessDays.findOne({
          where: { listingId: data.listingId }
        });
        const accessHoursToValidate = await ListingAccessHours.findAll({
          where: { listingAccessDaysId: accessDaysToValidate.id }
        });
        accessDaysToValidate.listingAccessHours = accessHoursToValidate;
      }
      const isReady: boolean = await this.isReadyCheck(
        data.listingId,
        data.title,
        data.bookingType,
        data.basePrice,
        accessDaysToValidate,
        listingObj.listSettingsParentId
      );
      let isPublished: boolean = listingObj.isPublished;
      if (!isReady) isPublished = false;
      const bookingPeriod =
        data.bookingPeriod !== undefined
          ? data.bookingPeriod
          : listingObj.bookingPeriod;
      await Listing.update(
        {
          title: data.title,
          bookingType: data.bookingType,
          bookingPeriod,
          isReady,
          isPublished
        },
        { where: { id: data.listingId }, individualHooks: true }
      );
      // Updating listing data informations...
      await ListingData.update(
        {
          listingId: data.listingId,
          accessType: data.accessType,
          bookingNoticeTime: data.bookingNoticeTime,
          minTerm: data.minTerm,
          maxTerm: data.maxTerm,
          description: data.description,
          basePrice: data.basePrice,
          currency: data.currency,
          isAbsorvedFee: data.isAbsorvedFee,
          capacity: data.capacity,
          size: data.size,
          meetingRooms: data.meetingRooms,
          isFurnished: data.isFurnished,
          carSpace: data.carSpace,
          sizeOfVehicle: data.sizeOfVehicle,
          maxEntranceHeight: data.maxEntranceHeight,
          spaceType: data.spaceType,
          bookingType: data.bookingType,
          link: data.link
        },
        { where: { listingId: data.listingId } }
      );
      // Checking out Amenities...
      if (data.listingAmenities) {
        await ListingAmenities.destroy({
          where: { listingId: data.listingId }
        });
        data.listingAmenities.map(async item => {
          await ListingAmenities.create({
            listingId: data.listingId,
            listSettingsId: item
          });
        });
      }
      // Checking out Exception Dates...
      if (data.listingExceptionDates) {
        // Updating Availabilities API...
        await axios.post(config.availabilitiesAPI, {
          listingId: data.listingId.toString(),
          blockedDates: data.listingExceptionDates
        });
      }
      // Checking out Listing Rules...
      if (data.listingRules) {
        await ListingRules.destroy({
          where: { listingId: data.listingId }
        });
        data.listingRules.map(async item => {
          await ListingRules.create({
            listingId: data.listingId,
            listSettingsId: item
          });
        });
      }
      // Checking out Access Days...
      if (data.listingAccessDays) {
        const listingAccessDays: IAccessDaysRequest = data.listingAccessDays;
        await ListingAccessDays.update(
          {
            mon: listingAccessDays.mon,
            tue: listingAccessDays.tue,
            wed: listingAccessDays.wed,
            thu: listingAccessDays.thu,
            fri: listingAccessDays.fri,
            sat: listingAccessDays.sat,
            sun: listingAccessDays.sun,
            all247: listingAccessDays.all247
          },
          { where: { listingId: data.listingId } }
        );
        const accessDayObj: ListingAccessDays | null = await ListingAccessDays.findOne(
          {
            where: { listingId: data.listingId }
          }
        );
        if (accessDayObj) {
          // Checking out Access Hours...
          await ListingAccessHours.destroy({
            where: { listingAccessDaysId: accessDayObj.id }
          });
          for (const item of listingAccessDays.listingAccessHours) {
            await ListingAccessHours.create({
              listingAccessDaysId: accessDayObj.id,
              weekday: item.weekday,
              openHour: new Date(parseInt(item.openHour, 10)),
              closeHour: new Date(parseInt(item.closeHour, 10)),
              allday: item.allday
            });
          }
        }
      }
      // Finish.
      res.send(listingObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getPublicListingsByIds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = req.body;
    const idString = JSON.stringify(data.ids);
    const cacheKey = `_public_listings_by_id_${idString}_`;
    try {
      const cacheData = this.cache.get(cacheKey);
      if (cacheData) {
        res.send(cacheData);
        return;
      }
      const listingsObj = await Listing.findAndCountAll({
        attributes: ["id", "title", "bookingPeriod"],
        include: [
          {
            model: UserProfile,
            as: "host",
            attributes: ["firstName", "lastName", "picture"]
          },
          {
            model: Location,
            as: "location",
            attributes: ["country", "city", "state"]
          },
          {
            model: ListingData,
            as: "listingData",
            attributes: [
              "basePrice",
              "currency",
              "capacity",
              "size",
              "meetingRooms",
              "isFurnished",
              "carSpace",
              "bookingType",
              "accessType"
            ]
          },
          {
            model: ListingPhotos,
            as: "listingPhotos",
            attributes: ["name"],
            limit: 1
          },
          {
            model: ListSettingsParent,
            as: "listingSettings",
            attributes: ["id"],
            include: [
              {
                model: ListSettings,
                as: "category",
                attributes: ["itemName"]
              },
              {
                model: ListSettings,
                as: "subCategory",
                attributes: ["itemName"]
              }
            ]
          }
        ],
        where: { id: data.ids }
      });
      this.cache.set(cacheKey, JSON.parse(JSON.stringify(listingsObj)));
      res.send(listingsObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  fetchAccessTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result: Array<ListSettings> = await ListSettings.findAll({
        where: { typeId: 113 }
      });
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingDataById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listingDataObj: ListingData | null = await ListingData.findOne({
        where: { listingId: req.params.listingId }
      });
      res.send(listingDataObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putChangeListingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.cache.flushAll();
      const listingId = req.params.listingId;
      const listingObj = await Listing.findOne({ where: { id: listingId } });
      if (!listingObj) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      await Listing.update(
        { status: req.params.status, isPublished: false },
        { where: { id: listingId } }
      );
      res.send(await Listing.findOne({ where: { id: listingId } }));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  onlyOwner(req: Request, listingObj: Listing) {
    const loggedUser: string | undefined = req.userIdDecoded;
    const loggedUserRole: string | undefined = req.userRoleDecoded;
    if (
      !loggedUser ||
      (loggedUser !== listingObj.userId && loggedUserRole !== "admin")
    )
      throw new HttpException(
        403,
        `Space ${listingObj.id} does not belong to user ${loggedUser}.`
      );
  }

  onlyOwnerOrAdmin(req: Request, listingObj: Listing) {
    const loggedUserId: string | undefined = req.userIdDecoded;
    const loggedUserRole: string | undefined = req.userRoleDecoded;

    if (
      !loggedUserId ||
      (loggedUserId !== listingObj.userId && loggedUserRole !== "admin")
    )
      throw new HttpException(
        403,
        `Space ${listingObj.id} does not belong to user ${loggedUserId}.`
      );
  }

  async fillDefaultTimeTable(accessDays: ListingAccessDays) {
    const openHour = new Date(`${format(new Date(), "YYYY-MM-DD")}T22:00`);
    const closeHour = new Date(`${format(new Date(), "YYYY-MM-DD")}T07:00`);
    let index: number = 1;
    while (index < 6) {
      await ListingAccessHours.create({
        listingAccessDaysId: accessDays.id,
        weekday: index,
        openHour: openHour,
        closeHour: closeHour,
        allday: false
      });
      index++;
    }
  }

  async isReady(listing: Listing): Promise<boolean> {
    const listingId = listing.id;

    const listingDataObj: ListingData | null = await ListingData.findOne({
      where: { listingId: listing.id },
      raw: true
    });
    if (!listingDataObj)
      throw new HttpException(
        400,
        `Listing ${listingId} does not have a 'Listing Data' associated.`
      );
    const basePrice = listingDataObj.basePrice;

    const accessDayObj: ListingAccessDays | null = await ListingAccessDays.findOne(
      { where: { listingId: listing.id } }
    );
    if (!accessDayObj)
      throw new HttpException(
        400,
        `Listing ${listingId} does not have an 'Access Days' associated.`
      );
    const listingAccessDay: any = accessDayObj;
    const accessHoursToValidate = await ListingAccessHours.findAll({
      where: { listingAccessDaysId: listingAccessDay.id }
    });
    listingAccessDay.listingAccessHours = accessHoursToValidate;

    const title = listing.title;

    const bookingType = listing.bookingType;

    return this.isReadyCheck(
      listingId,
      title,
      bookingType,
      basePrice,
      listingAccessDay,
      listing.listSettingsParentId
    );
  }

  async isReadyCheck(
    listingId: number,
    title?: string,
    bookingType?: string,
    basePrice?: number,
    listingAccessDays?: any,
    listingCategory?: number
  ): Promise<boolean> {
    // One photo at least...
    const photosCount = await ListingPhotos.count({ where: { listingId } });
    if (photosCount <= 0) return false;

    // Title content...
    if (!title) return false;

    // A booking type selected...
    if (!bookingType) return false;

    // A base price defined...
    if (bookingType != "poa" && (!basePrice || basePrice <= 0)) return false;

    // If got one day open for work...
    if (listingCategory != 20)
      if (!this.isOpenForWork(listingAccessDays)) return false;

    return true;
  }

  isOpenForWork(listingAccessDays?: any) {
    if (!listingAccessDays) return false;
    const { mon, tue, wed, thu, fri, sat, sun, all247 } = listingAccessDays;
    if (!mon && !tue && !wed && !thu && !fri && !sat && !sun && !all247)
      return false;
    if (!listingAccessDays.listingAccessHours) return false;
    const aWrongPeriod: Array<any> = listingAccessDays.listingAccessHours.filter(
      (o: { openHour: string; closeHour: string }) => {
        return (
          new Date(parseInt(o.openHour)).getTime() >
          new Date(parseInt(o.closeHour)).getTime()
        );
      }
    );
    return !(aWrongPeriod.length > 0);
  }

  getAllListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheData = this.cache.get(cacheKeys.COUNT_ALL);
      if (cacheData) {
        res.send(cacheData);
        return;
      }
      const data = await Listing.findAndCountAll({
        attributes: [
          "id",
          "userId",
          "isPublished",
          "title",
          "createdAt",
          "isReady",
          "status"
        ],
        include: [
          {
            model: Location,
            as: "location",
            attributes: ["country", "city", "state"]
          }
        ]
      });
      this.cache.set(cacheKeys.COUNT_ALL, JSON.parse(JSON.stringify(data)));
      res.send(data);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getAllHosts = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = await Listing.count({ distinct: true, col: "userId" });
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllHostsByDate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const days = request.query.days || 10000;
    const date = format(subDays(new Date(), days), "YYYY-MM-DD");
    try {
      const data = await Listing.count({
        where: {
          createdAt: {
            [Op.gte]: `${date}`
          }
        },
        distinct: true,
        col: "userId"
      });
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsByDate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const days = request.query.days || 10000;
    const category = request.query.category || null;
    const date = format(subDays(new Date(), days), "YYYY-MM-DD");
    let where = {
      createdAt: {
        [Op.gte]: `${date}`
      }
    };
    if (category && category !== null && category !== "null") {
      where = Object.assign({
        ...where,
        listSettingsParentId: { [Op.in]: [category] }
      });
    }
    try {
      const all = await Listing.count({ where: where });
      const active = await Listing.count({
        where: { ...where, status: "active" }
      });
      const deleted = await Listing.count({
        where: { ...where, status: "deleted" }
      });
      const published = await Listing.count({
        where: { ...where, isPublished: true }
      });
      response.send({ count: { all, active, deleted, published } });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsByCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const category = request.query.category;
    const where = { where: { listSettingsParentId: category }, raw: true };
    try {
      const data = await Listing.count(where);
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const category = request.query.category;
    const where = { where: { listSettingsParentId: category }, raw: true };
    try {
      const data = await Listing.count(where);
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getListingsCountCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    var listingsCategory = new Array();
    const categories = await _getCategories();
    for (const category of categories) {
      for (const item of category.subCategories) {
        const where = { listSettingsParentId: item.id };
        const all = await Listing.count({ where: where });
        const active = await Listing.count({
          where: { ...where, status: "active" }
        });
        const deleted = await Listing.count({
          where: { ...where, status: "deleted" }
        });
        const published = await Listing.count({
          where: { ...where, isPublished: true }
        });
        listingsCategory.push({
          category: item.subCategory.itemName,
          count: { all, active, deleted, published }
        });
      }
    }
    response.send(listingsCategory);
  };
}

export default ListingController;
