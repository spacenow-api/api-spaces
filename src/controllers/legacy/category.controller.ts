import { Router, Request, Response, NextFunction } from "express";

import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import {
  ListSettings,
  ListSettingsParent,
  SubcategoryBookingPeriod
} from "../../models";

const REFERENCE_CATEGORIES_ID: number = 111;

class CategoriesController {
  private router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/categories`, this.getCategories);
  }

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
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
      const data = await ListSettings.findAll({ ...where, ...include });
      res.send(data);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default CategoriesController;
