import { Router, Request, Response, NextFunction, request } from "express";
import Sequelize from "sequelize";
import NodeCache from "node-cache";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";

import { _getCategories } from "./../../categories/category.controller";

import {
  V2Listing,
  V2ListingData,
  V2ListingAccessDays,
  V2ListingAccessHours,
  V2ListingAmenities,
  V2ListingActivities,
  V2ListingAccess,
  V2ListingStyles,
  V2ListingRules,
  V2ListingFeatures,
  V2ListingPhotos,
  V2ListingExceptionDates,
  V2ListingTag,
  V2Location,
  V2Rule,
  V2Amenity,
  V2Feature,
  V2Tag
} from "../../../models/v2";

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
    this.router.get(`/v2/listings`, this.getListings);
    this.router.get(`/v2/listing/:id`, this.getListing);
    this.router.get(`/v2/listing/:id/activities`, this.getListingActivities);
    this.router.get(`/v2/listing/:id/access`, this.getListingAccess);
    this.router.get(`/v2/listing/:id/styles`, this.getListingStyles);
    this.router.get(`/v2/listing/:id/amenities`, this.getListingAmenities);
    this.router.get(`/v2/listing/:id/features`, this.getListingFeatures);
    this.router.get(`/v2/listing/:id/rules`, this.getListingRules);
    this.router.get(`/v2/listing/:id/tags`, this.getListingTags);
    this.router.get(`/v2/listing/:id/access-days`, this.getListingAccessDays);
    this.router.get(`/v2/listing/:id/access-days/:accessDayId`, this.getListingAccessHours);
    this.router.get(`/v2/user/:userId/listings`, authMiddleware, this.getUserListings);
    this.router.post(`/v2/listing`, authMiddleware, this.postListing);
    this.router.patch(`/v2/listing/:id`, authMiddleware, this.updateListing);
    this.router.delete(`/v2/listing/:id`, authMiddleware, this.deleteListing);
  }

  postListing = async (req: Request, res: Response, next: NextFunction) => {
    const userId = <string>(<unknown>req.userIdDecoded);
    try {
      res.send(
        await V2Listing.create({
          userId
        })
      );
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListing = async (req: Request, res: Response, next: NextFunction) => {
    const id = <string>(<unknown>req.params.id);
    if (!id) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const include = {
      include: [
        { model: V2ListingData, as: "listingData" },
        { model: V2Amenity, as: "amenities" },
        { model: V2Rule, as: "rules" },
        { model: V2Feature, as: "features" },
        { model: V2Tag, as: "tags" },
        { model: V2ListingPhotos, as: "photos" },
        { model: V2ListingExceptionDates, as: "exceptionDates" },
        {
          model: V2ListingAccessDays,
          as: "accessDays",
          include: [
            {
              model: V2ListingAccessHours,
              as: "accessHours"
            }
          ]
        }
      ]
    };
    try {
      const listingObj = await V2Listing.findByPk(id, include);
      if (!listingObj) {
        throw new HttpException(400, `Listing ${id} not found.`);
      }
      res.send(listingObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingAmenities = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingAmenities.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Amenities for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingActivities = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingActivities.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Activities for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingAccess = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingAccess.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Access for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingFeatures = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingFeatures.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Features for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingRules = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingRules.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Rules for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingTags = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <number>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingTag.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Tags for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      console.log("error", err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingStyles = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <number>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const obj = await V2ListingStyles.findAll(where);
      if (!obj) {
        throw new HttpException(400, `Styles for the Listing ${listingId} not found.`);
      }
      res.send(obj);
    } catch (err) {
      console.log("error", err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingAccessDays = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const where = { where: { listingId } };
    try {
      const accessDaysObj = await V2ListingAccessDays.findOne(where);
      if (!accessDaysObj) {
        throw new HttpException(400, `Access Days fot the Listing ${listingId} not found.`);
      }
      res.send(accessDaysObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListingAccessHours = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    const accessDayId = <string>(<unknown>req.params.accessDayId);
    if (!accessDayId) {
      throw new HttpException(400, `Access Day ID must be provided.`);
    }
    const where = { where: { listingAccessDaysId: accessDayId } };
    try {
      const accessHoursObj = await V2ListingAccessHours.findAll(where);
      if (!accessHoursObj) {
        throw new HttpException(400, `Access Hours fot the Listing ${listingId} not found.`);
      }
      res.send(accessHoursObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getListings = async (req: Request, res: Response, next: NextFunction) => {
    let { page, pageSize } = req.query;
    page = parseInt(page, 10) || 0;
    pageSize = parseInt(pageSize, 10) || 10;

    const cacheKey = `${cacheKeys.PLAIN_LIST}page_${page}_size_${pageSize}_`;
    const cacheData = this.cache.get(cacheKey);
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    try {
      const result = await V2Listing.findAndCountAll({
        limit: pageSize,
        offset: page * pageSize
      });
      this.cache.set(cacheKey, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getUserListings = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const cacheData = this.cache.get(`${cacheKeys.BY_USER}${userId}`);
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    const where = {
      where: {
        userId,
        status: { [Op.not]: "deleted" }
      }
    };

    try {
      const listingsObj = await V2Listing.findAndCountAll({
        ...where,
        order: [["updatedAt", "DESC"]]
      });
      this.cache.set(`${cacheKeys.BY_USER}${userId}`, JSON.parse(JSON.stringify(listingsObj)));
      res.send(listingsObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  updateListing = async (req: Request, res: Response, next: NextFunction) => {
    this.cache.flushAll();
    const id = req.params.id;
    const data = req.body;
    const include = {
      include: [
        { model: V2Location, as: "location" },
        { model: V2ListingPhotos, as: "photos" },
        { model: V2ListingData, as: "listingData" },
        { model: V2Amenity, as: "amenities" },
        { model: V2Rule, as: "rules" },
        { model: V2Feature, as: "features" },
        { model: V2Tag, as: "tags" },
        {
          model: V2ListingAccessDays,
          as: "accessDays",
          include: [{ model: V2ListingAccessHours, as: "accessHours" }]
        }
      ]
    };
    const where = { where: { listingId: id } };

    try {
      const listing = await V2Listing.findByPk(id, include);
      if (!listing) throw new Error(`Listing ${id} not found.`);
      this.onlyOwner(req, listing);
      await V2ListingAmenities.destroy(where);
      data.amenities &&
        data.amenities.length > 0 &&
        (await data.amenities.map(
          async (amenity: any) =>
            await V2ListingAmenities.create({
              listingId: id,
              amenityId: amenity.id
            })
        ));
      await V2ListingRules.destroy(where);
      data.rules &&
        data.rules.length > 0 &&
        (await data.rules.map(
          async (rule: any) =>
            await V2ListingRules.create({
              listingId: id,
              ruleId: rule.id
            })
        ));
      await V2ListingFeatures.destroy(where);
      data.features &&
        data.features.length > 0 &&
        (await data.features.map(
          async (feature: any) =>
            await V2ListingFeatures.create({
              listingId: id,
              listSettingsId: feature.id
            })
        ));
      await V2ListingTag.destroy(where);
      data.tags &&
        data.tags.length > 0 &&
        (await data.tags.map(
          async (tag: any) =>
            await V2ListingTag.create({
              listingId: id,
              tagId: tag.id
            })
        ));
      await V2ListingPhotos.destroy(where);
      data.photos && data.photos.length > 0 && (await data.photos.map(async (photo: any) => await V2ListingPhotos.create({ ...photo, listingId: id })));
      data.accessDays &&
        data.accessDays.accessHours &&
        (await data.accessDays.accessHours.map(
          async (accessHour: any) =>
            await V2ListingAccessHours.update(accessHour, {
              where: { id: accessHour.id }
            })
        ));
      await listing.accessDays.update(data.accessDays);
      await listing.listingData.update(data.listingData);
      await listing.update(data);
      res.send(await listing.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteListing = async (req: Request, res: Response, next: NextFunction) => {
    this.cache.flushAll();
    const listingId = req.params.listingId;
    const where = { where: { id: listingId } };

    try {
      const listingObj = await V2Listing.findOne(where);
      if (!listingObj) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      this.onlyOwner(req, listingObj);
      await V2Listing.update({ status: "deleted", isPublished: false }, where);
      res.send({ status: "OK" });
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  onlyOwner(req: Request, listingObj: V2Listing) {
    const loggedUser: string | undefined = req.userIdDecoded;
    const loggedUserRole: string | undefined = req.userRoleDecoded;
    if (!loggedUser || (loggedUser !== listingObj.userId && loggedUserRole !== "admin")) throw new HttpException(403, `Space ${listingObj.id} does not belong to user ${loggedUser}.`);
  }
}

export default ListingController;
