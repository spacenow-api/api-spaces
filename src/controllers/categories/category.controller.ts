import { Router, Request, Response, NextFunction } from "express";

import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import {
  Category,
  CategoryBookingPeriod,
  ListSettings,
  ListSettingsParent,
  SubcategoryBookingPeriod
} from "../../models";

const REFERENCE_CATEGORIES_ID: number = 111;

export const _getCategories = () => {
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

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/categories`, this.getCategories);
    this.router.get(`/v2/categories`, this.getV2Categories);
  }

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    const data = await _getCategories();
    if (data.err) sequelizeErrorMiddleware(data.err, req, res, next);
    res.send(data);
  };

  getV2Categories = async (req: Request, res: Response, next: NextFunction) => {
    const include = {
      include: [
        {
          model: CategoryBookingPeriod
        }
      ]
    };

    try {
      const data = await Category.findAll(include);
      res.send(data);
    } catch (error) {
      sequelizeErrorMiddleware(error, req, res, next);
    }
  };
}

export default CategoriesController;
