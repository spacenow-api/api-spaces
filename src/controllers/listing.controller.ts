import { Router, Request, Response, NextFunction } from 'express';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { Listing, ListingData } from '../models';

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
