import { Router, Request, Response, NextFunction } from 'express';

import HttpException from '../helpers/exceptions/HttpException';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { Listing, ListingData, Location, ListingAccessDays } from '../models';

import { IDraftRequest } from '../interfaces/listing.interface';

class ListingController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get listing by ID.
     */
    this.router.get(
      `/listings/:id`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const where: { id: number; [key: string]: any } = {
            id: req.params.id
          };
          const { isPublished } = req.query;
          if (isPublished) {
            where.isPublished = isPublished === 'true';
          }
          const listingObj: Listing = await Listing.findOne({ where });
          res.send(listingObj);
        } catch (error) {
          sequelizeErrorMiddleware(error, req, res, next);
        }
      }
    );

    /**
     * Get listing data by listing ID.
     */
    this.router.get(
      `/listings/data/:listingId`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const listingDataObj: Listing = await ListingData.findOne({
            where: {
              listingId: req.params.listingId
            }
          });
          res.send(listingDataObj);
        } catch (error) {
          sequelizeErrorMiddleware(error, req, res, next);
        }
      }
    );

    /**
     * Creating a new listing as a draft only with basic informations.
     */
    this.router.post(
      '/listings/draft',
      async (req: Request, res: Response, next: NextFunction) => {
        const data: IDraftRequest = req.body;
        try {
          if (!data.locationId)
            next(new HttpException(400, 'A location must be provided.'));
          const locationObj: Location = await Location.findOne({
            where: { id: data.locationId }
          });
          if (!locationObj)
            next(new HttpException(400, 'A location must be provided.'));
          // Creating listing record...
          const listingObj: Listing = await Listing.create({
            locationId: data.locationId,
            listSettingsParentId: data.listSettingsParentId,
            bookingPeriod: data.bookingPeriod,
            title: data.title,
            coverPhotoId: data.coverPhotoId,
            quantity: data.quantity,
            userId: data.userId
          });
          // Creating listing-data record...
          await ListingData.findOrCreate({
            where: { listingId: listingObj.id }
          });
          // Creating access-days record...
          await ListingAccessDays.findOrCreate({
            where: { listingId: listingObj.id }
          });
          res.send(listingObj);
        } catch (err) {
          sequelizeErrorMiddleware(err, req, res, next);
        }
      }
    );

    /**
     * Update a Listing with all data required.
     */
    this.router.put(
      '/listings/update',
      async (req: Request, res: Response, next: NextFunction) => {}
    );
  }
}

export default ListingController;
