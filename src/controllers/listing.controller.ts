import { Router, Request, Response, NextFunction } from 'express';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { Listing, ListingData } from '../models';

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
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const where: { id: number; [key: string]: any } = {
            id: request.params.id
          };
          const { isPublished } = request.query;
          if (isPublished) {
            where.isPublished = isPublished === 'true';
          }
          const listingObj: Listing = await Listing.findOne({ where });
          response.send(listingObj);
        } catch (error) {
          sequelizeErrorMiddleware(error, request, response, next);
        }
      }
    );

    /**
     * Get listing data by listing ID.
     */
    this.router.get(
      `/listings/data/:listingId`,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const listingDataObj: Listing = await ListingData.findOne({
            where: {
              listingId: request.params.listingId
            }
          });
          response.send(listingDataObj);
        } catch (error) {
          sequelizeErrorMiddleware(error, request, response, next);
        }
      }
    );
  }
}

export default ListingController;
