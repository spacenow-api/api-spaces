import { Router, Request, Response, NextFunction } from 'express';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';

import { Listing, ListSettings, ListSettingsParent } from '../models';

class ListSettingsController {
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
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const listingObj: Listing = await Listing.findOne({
            where: { id: request.params.listingId },
            attributes: ['listSettingsParentId']
          });
          const parentObj: ListSettingsParent = await ListSettingsParent.findOne({
            where: { id: listingObj.listSettingsParentId }
          });
          const categoryObj: ListSettings = await ListSettings.findOne({
            where: { id: parentObj.listSettingsParentId }
          });
          const subCategoryObj: ListSettings = await ListSettings.findOne({
            where: { id: parentObj.listSettingsChildId }
          });
          response.send({
            id: parentObj.id,
            category: categoryObj,
            subcategory: subCategoryObj
          });
        } catch (error) {
          console.error(error);
          sequelizeErrorMiddleware(error, request, response, next);
        }
      }
    );
  }
}

export default ListSettingsController;
