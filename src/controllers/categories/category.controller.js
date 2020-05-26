const { Router, Request, Response, NextFunction } = require("express");
const NodeCache = require("node-cache");

const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { Category, CategoryBookingPeriod, ListSettings, ListSettingsParent, SubcategoryBookingPeriod } = require("../../models");

const REFERENCE_CATEGORIES_ID = 111;

const CACHE_KEY = "_categories_";

export const _getCategories = () => {
  const include = {
    include: [
      {
        model,
        include: [
          {
            model,
            as: "subCategory"
          },
          {
            model
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
  router = Router();

  // Standard expiration time for 3 days...
  cache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get(`/categories`, this.getCategories);
    // this.router.get(`/v2/categories`, this.getV2Categories);
  }

  getCategories = async (req, res, next) => {
    try {
      // let data = this.cache.get(CACHE_KEY);
      // if (!data) {
      const data = await _getCategories();
      // if (data.err) {
      //   sequelizeErrorMiddleware(data.err, req, res, next);
      //   return;
      // }
      // this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(data)));
      // }
      res.send(data);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  // getV2Categories = async (req, res, next) => {
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
