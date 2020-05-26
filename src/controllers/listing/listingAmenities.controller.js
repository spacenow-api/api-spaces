const { Router, Request, Response, NextFunction } = require("express");
const NodeCache = require("node-cache");

const { authMiddleware } = require("../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { ListSettings, ListSettingsParent, ListingAmenities } = require("../../models");

class ListingAmenitiesController {
  router = Router();

  // Standard expiration time for 3 days...
  cache = new NodeCache({ stdTTL: 900 });

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    /**
     * Get listing Amenities by listing ID.
     */
    this.router.get(`/listings/amenities/:listingId`, async (req, res, next) => {
      try {
        const amenitiesArray = await ListingAmenities.findAll({
          where: { listingId: req.params.listingId },
          raw: true,
        });
        const result = new Array();
        for (const item of amenitiesArray) {
          const settingsObj = await ListSettings.findOne({
            where: { id: item.listSettingsId, isEnable: "1" },
            raw: true,
          });
          if (settingsObj) result.push({ ...item, settingsData: { ...settingsObj } });
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
    this.router.get(`/listings/fetch/amenities/:listSettingsParentId`, authMiddleware, async (req, res, next) => {
      // const cacheKey = `_listing_amenities_${req.params.listSettingsParentId}_`;
      try {
        // const cacheData = this.cache.get(cacheKey);
        // if (cacheData) {
        //   res.send(cacheData);
        //   return;
        // }
        const parentsArray = await ListSettingsParent.findAll({
          where: { listSettingsParentId: req.params.listSettingsParentId },
          raw: true,
        });
        const result = new Array();
        for (const item of parentsArray) {
          const settingsObj = await ListSettings.findOne({
            where: { id: item.listSettingsChildId, isEnable: "1", typeId: "115" },
            raw: true,
          });
          if (settingsObj) {
            result.push(settingsObj);
          }
        }
        // this.cache.set(cacheKey, result);
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingAmenitiesController;
