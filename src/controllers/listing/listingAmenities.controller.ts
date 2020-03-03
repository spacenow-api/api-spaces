import { Router, Request, Response, NextFunction } from "express";
import NodeCache from 'node-cache';

import { authMiddleware } from '../../helpers/middlewares/auth-middleware';
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { ListSettings, ListSettingsParent, ListingAmenities } from "../../models";

class ListingAmenitiesController {

  private router = Router();

  // Standard expiration time for 3 days...
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get listing Amenities by listing ID.
     */
    this.router.get(`/listings/amenities/:listingId`, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const amenitiesArray: Array<ListingAmenities> = await ListingAmenities.findAll({
          where: { listingId: req.params.listingId },
          raw: true
        });
        const result = new Array<any>();
        for (const item of amenitiesArray) {
          const settingsObj: ListSettings | null = await ListSettings.findOne({
            where: { id: item.listSettingsId, isEnable: "1" },
            raw: true
          });
          if (settingsObj)
            result.push({ ...item, settingsData: { ...settingsObj } });
        }
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Get all amenities from sub-category ID
     */
    this.router.get(`/listings/fetch/amenities/:listSettingsParentId`, authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      const cacheKey = `_listing_amenities_${req.params.listSettingsParentId}_`;
      try {
        const cacheData = this.cache.get(cacheKey);
        if (cacheData) {
          res.send(cacheData);
          return;
        }
        const parentsArray: Array<ListSettingsParent> = await ListSettingsParent.findAll({
          where: { listSettingsParentId: req.params.listSettingsParentId },
          raw: true
        })
        const result = new Array<any>();
        for (const item of parentsArray) {
          const settingsObj: ListSettings | null = await ListSettings.findOne({
            where: { id: item.listSettingsChildId, isEnable: "1", typeId: "115" },
            raw: true
          });
          if (settingsObj) {
            result.push(settingsObj);
          }
        }
        this.cache.set(cacheKey, result);
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingAmenitiesController;
