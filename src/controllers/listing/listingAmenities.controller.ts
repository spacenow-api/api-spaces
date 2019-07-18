import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from '../../helpers/middlewares/auth-middleware';
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { ListSettings, ListingAmenities } from "../../models";

class ListingAmenitiesController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get listing Amenities by listing ID.
     */
    this.router.get(`/listings/amenities/:listingId`, authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const amenitiesArray: Array<ListingAmenities> = await ListingAmenities.findAll({
          where: { listingId: req.params.listingId },
          raw: true
        });
        const result = new Array<any>();
        for (const item of amenitiesArray) {
          const settingsObj: ListSettings | null = await ListSettings.findOne({
            where: { id: item.listSettingsId },
            raw: true
          });
          result.push({ ...item, settingsData: { ...settingsObj } });
        }
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingAmenitiesController;
