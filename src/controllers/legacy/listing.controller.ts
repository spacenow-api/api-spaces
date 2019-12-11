import { Router, Request, Response, NextFunction } from "express";
import { subDays, format } from "date-fns";
import Sequelize from "sequelize";
import { authMiddleware } from "../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import { _getCategories } from "./category.controller";

import { Listing, Location } from "../../models";

const Op = Sequelize.Op;

class ListingLegacyController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/listings`, authMiddleware, this.getAllListings);
    this.router.get(`/listings/count/hosts`, authMiddleware, this.getAllHosts);
    this.router.get(
      `/listings/count/hosts/date`,
      authMiddleware,
      this.getAllHostsByDate
    );
    this.router.get(
      `/listings/count/date`,
      authMiddleware,
      this.getAllListingsByDate
    );
    this.router.get(
      `/listings/count/categories`,
      authMiddleware,
      this.getListingsCountCategories
    );
  }

  getAllListings = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    // next(new HttpException(200, `Listings test.`));
    const data = await Listing.findAndCountAll({
      attributes: [
        "id",
        "userId",
        "isPublished",
        "title",
        "createdAt",
        "isReady",
        "status"
      ],
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["country", "city", "state"]
        }
      ]
    });

    return response.send(data);
  };

  getAllHosts = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = await Listing.count({
        distinct: true,
        col: "userId"
      });
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllHostsByDate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const days = request.query.days || 10000;
    const date = format(subDays(new Date(), days), "YYYY-MM-DD");
    try {
      const data = await Listing.count({
        where: {
          createdAt: {
            [Op.gte]: `${date}`
          }
        },
        distinct: true,
        col: "userId"
      });
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsByDate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const days = request.query.days || 10000;
    const category = request.query.category || null;
    const date = format(subDays(new Date(), days), "YYYY-MM-DD");

    let where = {
      createdAt: {
        [Op.gte]: `${date}`
      }
    };

    if (category && category !== null && category !== "null") {
      where = Object.assign({
        ...where,
        listSettingsParentId: { [Op.in]: [category] }
      });
    }

    try {
      const all = await Listing.count({ where: where });
      const active = await Listing.count({
        where: { ...where, status: "active" }
      });
      const deleted = await Listing.count({
        where: { ...where, status: "deleted" }
      });
      const published = await Listing.count({
        where: { ...where, isPublished: true }
      });
      response.send({ count: { all, active, deleted, published } });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsByCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const category = request.query.category;
    const where = { where: { listSettingsParentId: category }, raw: true };

    try {
      const data = await Listing.count(where);
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const category = request.query.category;
    const where = { where: { listSettingsParentId: category }, raw: true };

    try {
      const data = await Listing.count(where);
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getListingsCountCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    var listingsCategory = new Array();
    const categories = await _getCategories();

    for (const category of categories) {
      for (const item of category.subCategories) {
        const where = { listSettingsParentId: item.id };
        const all = await Listing.count({ where: where });
        const active = await Listing.count({
          where: { ...where, status: "active" }
        });
        const deleted = await Listing.count({
          where: { ...where, status: "deleted" }
        });
        const published = await Listing.count({
          where: { ...where, isPublished: true }
        });
        listingsCategory.push({
          category: item.subCategory.itemName,
          count: { all, active, deleted, published }
        });
      }
    }
    response.send(listingsCategory);
  };
}

export default ListingLegacyController;
