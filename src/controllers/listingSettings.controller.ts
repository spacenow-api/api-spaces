import { Router, Request, Response, NextFunction } from 'express';

import HttpException from '../helpers/exceptions/HttpException';
import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { Listing, ListSettings, ListSettingsParent } from '../models';

class ListingSettingsController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get list settings by listing id.
     */
    this.router.get(
      `/listings/settings/:listingId`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const listingObj: Listing | null = await Listing.findOne({
            where: { id: req.params.listingId },
            attributes: ['listSettingsParentId']
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
              res.send({
                id: parentObj.id,
                category: categoryObj,
                subcategory: subCategoryObj
              });
            } else {
              next(new HttpException(400, `Listing Parent record ${listingObj.listSettingsParentId} not found.`));
            }
          } else {
            next(new HttpException(400, `Listing ${req.params.listingId} not found.`));
          }
        } catch (err) {
          console.error(err);
          sequelizeErrorMiddleware(err, req, res, next);
        }
      }
    );
  }
}

export default ListingSettingsController;
