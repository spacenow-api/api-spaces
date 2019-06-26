import { Router, Request, Response, NextFunction } from 'express';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { Listing } from '../models';

const PATH = '/listings';

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
      `${PATH}/:id`,
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
          console.error(error);
          sequelizeErrorMiddleware(error, request, response, next);
        }
      }
    );
  }
}

export default ListingController;
