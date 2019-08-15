import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from '../../helpers/middlewares/auth-middleware';
import HttpException from "../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Listing, ListSettings, ListSettingsParent, SubcategorySpecifications, SubcategoryBookingPeriod } from "../../models";

class ListingSettingsController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get list settings by listing id.
     */
    this.router.get(`/listings/settings/:listingId`, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listingObj: Listing | null = await Listing.findOne({
          where: { id: req.params.listingId },
          attributes: ["listSettingsParentId"]
        });
        if (listingObj) {
          const parentObj: ListSettingsParent | null = await ListSettingsParent.findOne({
            where: { id: listingObj.listSettingsParentId }
          });
          if (parentObj) {
            const categoryObj: ListSettings | null = await ListSettings.findOne({
              where: { id: parentObj.listSettingsParentId }
            });
            const subCategoryObj: ListSettings | null = await ListSettings.findOne({
              where: { id: parentObj.listSettingsChildId }
            });
            const bookingPeriodObj: SubcategoryBookingPeriod | null = await SubcategoryBookingPeriod.findOne({
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
    this.router.get(`/listings/settings/specifications/:listSettingsParentId`, authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const specificationsArray: Array<SubcategorySpecifications> = await SubcategorySpecifications.findAll({
          where: { listSettingsParentId: req.params.listSettingsParentId },
          raw: true
        })
        const result = new Array<any>();
        for (const item of specificationsArray) {
          const settingsObj: ListSettings | null = await ListSettings.findOne({
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
