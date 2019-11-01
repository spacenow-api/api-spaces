import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from '../../helpers/middlewares/auth-middleware';
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { ListSettings, ListingRules } from "../../models";

class ListingRulesController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    /**
     * Get listing Rules by listing ID.
     */
    this.router.get(`/listings/rules/:listingId`, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rulesArray: Array<ListingRules> = await ListingRules.findAll({
          where: { listingId: req.params.listingId },
          raw: true
        });
        const result = new Array<any>();
        for (const item of rulesArray) {
          const settingsObj: ListSettings | null = await ListSettings.findOne({
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
    this.router.get(`/listings/fetch/rules`, authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result: Array<ListSettings> = await ListSettings.findAll({ where: { typeId: 14, isEnable: 1 } });
        res.send(result);
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingRulesController;
