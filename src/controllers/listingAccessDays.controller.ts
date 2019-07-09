import { Router, Request, Response, NextFunction } from 'express';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { ListingAccessDays, ListingAccessHours } from '../models';

class ListingAccessDaysController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get listing Access Days and Hours by listing ID.
     */
    this.router.get(
      `/listings/access/:listingId`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const daysObj: ListingAccessDays = await ListingAccessDays.findOne({
            where: { listingId: req.params.listingId },
            raw: true
          });
          const hoursArray: Array<ListingAccessHours> = await ListingAccessHours.findAll({
            where: { listingAccessDaysId: daysObj.id },
            raw: true
          });
          res.send({ listingAccessDays: { ...daysObj, listingAccessHours: hoursArray } });
        } catch (err) {
          console.error(err);
          sequelizeErrorMiddleware(err, req, res, next);
        }
      }
    );
  }
}

export default ListingAccessDaysController;
