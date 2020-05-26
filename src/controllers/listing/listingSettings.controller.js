const { Router } = require("express");

const HttpException = require("../../helpers/exceptions/HttpException");
const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { Listing, ListSettings, ListSettingsParent, SubcategorySpecifications, SubcategoryBookingPeriod } = require("../../models");

class ListingSettingsController {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    /**
     * Get list settings by listing id.
     */
    this.router.get(`/listings/settings/:listingId`, async (req, res, next) => {
      try {
        const listingObj = await Listing.findOne({
          where: { id: req.params.listingId },
          attributes: ["listSettingsParentId"]
        });
        if (listingObj) {
          const parentObj = await ListSettingsParent.findOne({
            where: { id: listingObj.listSettingsParentId }
          });
          if (parentObj) {
            const categoryObj = await ListSettings.findOne({
              where: { id: parentObj.listSettingsParentId }
            });
            const subCategoryObj = await ListSettings.findOne({
              where: { id: parentObj.listSettingsChildId }
            });
            const bookingPeriodObj = await SubcategoryBookingPeriod.findOne({
              where: { listSettingsParentId: listingObj.listSettingsParentId }
            });
            res.send({
              id: parentObj.id,
              category: categoryObj,
              subcategory: subCategoryObj,
              bookingPeriod: bookingPeriodObj
            });
          } else {
            throw new HttpException(400, `Listing Parent record ${listingObj.listSettingsParentId} not found.`);
          }
        } else {
          throw new HttpException(400, `Listing ${req.params.listingId} not found.`);
        }
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Get all specifications from sub-category ID
     */
    this.router.get(`/listings/settings/specifications/:listSettingsParentId`, async (req, res, next) => {
      try {
        const specificationsArray = await SubcategorySpecifications.findAll({
          where: { listSettingsParentId: req.params.listSettingsParentId },
          raw: true
        })
        const result = new Array();
        for (const item of specificationsArray) {
          const settingsObj = await ListSettings.findOne({
            where: { id: item.listSettingsSpecificationId },
            raw: true
          });
          result.push(settingsObj);
        }
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingSettingsController;
