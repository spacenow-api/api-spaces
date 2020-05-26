const { Router } = require("express");

const { authMiddleware } = require('../../helpers/middlewares/auth-middleware');
const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { ListSettings, ListingRules } = require("../../models");

class ListingRulesController {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    /**
     * Get listing Rules by listing ID.
     */
    this.router.get(`/listings/rules/:listingId`, async (req, res, next) => {
      try {
        const rulesArray = await ListingRules.findAll({
          where: { listingId: req.params.listingId },
          raw: true
        });
        const result = new Array();
        for (const item of rulesArray) {
          const settingsObj = await ListSettings.findOne({
            where: { 
              id: item.listSettingsId,
              isEnable: 1
            },
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
     * Get all rules from sub-category ID
     */
    this.router.get(`/listings/fetch/rules`, authMiddleware, async (req, res, next) => {
      try {
        const result = await ListSettings.findAll({ where: { typeId: 14, isEnable: 1 } });
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingRulesController;
