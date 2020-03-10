import { Router, Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";

import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Category, CategoryBookingPeriod, ListSettings, ListSettingsParent, SubcategoryBookingPeriod } from "../../models";

const REFERENCE_CATEGORIES_ID: number = 111;

const CACHE_KEY = "_categories_";

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
    return ListSettings.findAll({ ...where, ...include });
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
    // this.router.get(`/v2/categories`, this.getV2Categories);
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
        this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(data)));
      }
      res.send(data);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  // getV2Categories = async (req: Request, res: Response, next: NextFunction) => {
  //   const include = {
  //     include: [
  //       {
  //         model: CategoryBookingPeriod
  //       }
  //     ]
  //   };

  //   try {
  //     const data = await Category.findAll(include);
  //     res.send(data);
  //   } catch (error) {
  //     sequelizeErrorMiddleware(error, req, res, next);
  //   }
  // };
}

export default CategoriesController;
