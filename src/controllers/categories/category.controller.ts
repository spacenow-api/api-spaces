import { Router, Request, Response, NextFunction } from "express";
import NodeCache from 'node-cache';

import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import {
  ListSettings,
  ListSettingsParent,
  SubcategoryBookingPeriod
} from "../../models";

const REFERENCE_CATEGORIES_ID: number = 111;

const CACHE_KEY = '_categories_full_'

export const _getCategories = (): Promise<Array<ListSettings>> => {
  const include = {
    include: [
      {
        model: ListSettingsParent,
        include: [
          {
            model: ListSettings,
            as: "subCategory"
          },
          {
            model: SubcategoryBookingPeriod
          }
        ]
      }
    ]
  };
  const where = {
    where: {
      typeId: REFERENCE_CATEGORIES_ID
    }
  };
  try {
    return ListSettings.findAll({ ...where, ...include, raw: true });
  } catch (err) {
    return err;
  }
};

class CategoriesController {

  private router: Router = Router();

  // Standard expiration time for 3 days...
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/categories`, this.getCategories);
  }

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: any = this.cache.get(CACHE_KEY);
      if (!data) {
        data = await _getCategories();
        if (data.err) {
          sequelizeErrorMiddleware(data.err, req, res, next);
          return;
        }
        this.cache.set(CACHE_KEY, data);
      }
      res.send(data);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default CategoriesController;
