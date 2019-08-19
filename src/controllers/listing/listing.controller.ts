import { Router, Request, Response, NextFunction } from "express";
import { format } from 'date-fns';
import axios from "axios";

import * as config from "../../config";

import authMiddleware from "../../helpers/middlewares/auth-middleware";
import HttpException from "../../helpers/exceptions/HttpException";

import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import {
  Listing,
  ListingData,
  Location,
  ListingAccessDays,
  ListingAmenities,
  ListingAccessHours,
  ListingRules,
  ListingPhotos,
  ListSettings
} from "../../models";

import {
  IDraftRequest,
  IUpdateRequest,
  IAccessDaysRequest
} from "../../interfaces/listing.interface";

class ListingController {

  private path = '/listings'
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  /**
   * Get listing by ID.
   */
  private getListingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const listingId = <number><unknown>req.params.id;
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
    
  private intializeRoutes() { 
    this.router.get(`/listings/:id`, authMiddleware, this.getListingById)
    this.router.get(`/listings/public/:id`, this.getListingById)

  
    /**
     * 
     * Get listing data by listing ID.
     */
    this.router.get(`/listings/data/:listingId`, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listingDataObj: ListingData | null = await ListingData.findOne({
          where: { listingId: req.params.listingId }
        });
        res.send(listingDataObj);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Get all Access Types for a Listing.
     */
    this.router.get(`/listings/fetch/accesstypes`, authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result: Array<ListSettings> = await ListSettings.findAll({ where: { typeId: 113 } });
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Creating a new listing as a draft only with basic informations.
     */
    this.router.post("/listings/draft", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      const data: IDraftRequest = req.body;
      try {
        if (!data.locationId) throw new HttpException(400, "A location must be provided.");
        const locationObj: Location | null = await Location.findOne({ where: { id: data.locationId } });
        if (!locationObj) throw new HttpException(400, "A location must be provided.");
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
        await ListingData.findOrCreate({ where: { listingId: listingObj.id } });
        // Creating access-days record...
        const [accessDaysCreated, _] = await ListingAccessDays.findOrCreate({ where: { listingId: listingObj.id } });
        await this.fillDefaultTimeTable(accessDaysCreated);
        res.send(listingObj);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Update a Listing with all data required.
     */
    this.router.put("/listings/update", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      const data: IUpdateRequest = req.body;
      try {
        // Getting listing record...
        const listingObj: Listing | null = await Listing.findOne({ where: { id: data.listingId } });
        if (!listingObj) throw new HttpException(400, `Listing ${data.listingId} not found.`);

        // User Validation...
        this.onlyOwner(req, listingObj);

        // Updating isReady rule...
        let accessDaysToValidate: any = data.listingAccessDays;
        if (!accessDaysToValidate) {
          accessDaysToValidate = await ListingAccessDays.findOne({ where: { listingId: data.listingId } });
          const accessHoursToValidate = await ListingAccessHours.findAll({ where: { listingAccessDaysId: accessDaysToValidate.id } });
          accessDaysToValidate.listingAccessHours = accessHoursToValidate;
        }
        const isReady: boolean = await this.isReadyCheck(
          data.listingId,
          data.title,
          data.bookingType,
          data.basePrice,
          accessDaysToValidate
        );
        let isPublished: boolean = listingObj.isPublished;
        if (!isReady) isPublished = false;
        const bookingPeriod = data.bookingPeriod !== undefined ? data.bookingPeriod : listingObj.bookingPeriod;
        await Listing.update({
          title: data.title,
          bookingType: data.bookingType,
          bookingPeriod,
          isReady,
          isPublished
        }, { where: { id: data.listingId } });

        // Updating listing data informations...
        await ListingData.update({
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
          bookingType: data.bookingType
        }, { where: { listingId: data.listingId } });

        // Checking out Amenities...
        if (data.listingAmenities) {
          await ListingAmenities.destroy({ where: { listingId: data.listingId } });
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
          await ListingRules.destroy({ where: { listingId: data.listingId } });
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
          await ListingAccessDays.update({
            mon: listingAccessDays.mon,
            tue: listingAccessDays.tue,
            wed: listingAccessDays.wed,
            thu: listingAccessDays.thu,
            fri: listingAccessDays.fri,
            sat: listingAccessDays.sat,
            sun: listingAccessDays.sun,
            all247: listingAccessDays.all247
          }, { where: { listingId: data.listingId } });

          const accessDayObj: ListingAccessDays | null = await ListingAccessDays.findOne({ where: { listingId: data.listingId } });

          if (accessDayObj) {
            // Checking out Access Hours...
            await ListingAccessHours.destroy({ where: { listingAccessDaysId: accessDayObj.id } });
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
    });

    /**
     * Publish listing.
     */
    this.router.put("/listings/:listingId/publish/:status", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      const listingId = req.params.listingId;
      try {
        const listingObj: Listing | null = await Listing.findOne({ where: { id: listingId } });
        if (!listingObj) {
          throw new HttpException(400, `Listing ${listingId} not found.`);
        }
        const isToPublished: Boolean = /true/i.test(req.params.status);
        if (isToPublished) {
          const isReadyConditional = await this.isReady(listingObj);
          await Listing.update({ isPublished: isReadyConditional }, { where: { id: listingId } });
          if (!isReadyConditional) {
            throw new HttpException(400, `Listing ${listingId} is not ready to publish.`);
          }
        } else {
          await Listing.update({ isPublished: false }, { where: { id: listingId } });
        }
        const listingUpdated = await Listing.findOne({ where: { id: listingId } });
        res.send(listingUpdated);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  
  }

  private onlyOwner(req: Request, listingObj: Listing) {
    const loggedUser: string | undefined = req.userIdDecoded;
    if (!loggedUser || (loggedUser !== listingObj.userId))
      throw new HttpException(403, `Space ${listingObj.id} does not belong to user ${loggedUser}.`);
  }

  private async fillDefaultTimeTable(accessDays: ListingAccessDays) {
    const openHour = new Date(`${format(new Date(), 'YYYY-MM-DD')}T22:00`);
    const closeHour = new Date(`${format(new Date(), 'YYYY-MM-DD')}T07:00`);
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

    const listingDataObj: ListingData | null = await ListingData.findOne({ where: { listingId: listing.id }, raw: true });
    if (!listingDataObj)
      throw new HttpException(400, `Listing ${listingId} does not have a 'Listing Data' associated.`);
    const basePrice = listingDataObj.basePrice;

    const accessDayObj: ListingAccessDays | null = await ListingAccessDays.findOne({ where: { listingId: listing.id } });
    if (!accessDayObj)
      throw new HttpException(400, `Listing ${listingId} does not have an 'Access Days' associated.`);
    const listingAccessDay: any = accessDayObj;
    const accessHoursToValidate = await ListingAccessHours.findAll({ where: { listingAccessDaysId: listingAccessDay.id } });
    listingAccessDay.listingAccessHours = accessHoursToValidate;

    const title = listing.title;
    const bookingType = listing.bookingType;
    return this.isReadyCheck(listingId, title, bookingType, basePrice, listingAccessDay);
  }

  async isReadyCheck(listingId: number, title?: string, bookingType?: string, basePrice?: number, listingAccessDays?: any): Promise<boolean> {
    // One photo at least...
    const photosCount = await ListingPhotos.count({ where: { listingId } });
    if (photosCount <= 0) return false;

    // Title content...
    if (!title) return false;

    // A booking type selected...
    if (!bookingType) return false;

    // A base price defined...
    if (!basePrice || basePrice <= 0) return false;

    // If got one day open for work...
    if (!this.isOpenForWork(listingAccessDays)) return false;

    return true;
  }

  private isOpenForWork(listingAccessDays?: any) {
    if (!listingAccessDays) return false;
    const { mon, tue, wed, thu, fri, sat, sun, all247 } = listingAccessDays;
    if (!mon && !tue && !wed && !thu && !fri && !sat && !sun && !all247) return false;
    if (!listingAccessDays.listingAccessHours) return false;
    const aWrongPeriod: Array<any> = listingAccessDays.listingAccessHours
      .filter((o: { openHour: string; closeHour: string; }) => {
        return new Date(parseInt(o.openHour)).getTime() > new Date(parseInt(o.closeHour)).getTime();
      })
    return !(aWrongPeriod.length > 0);
  }
  
}

export default ListingController;
