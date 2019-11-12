import { Router, Request, Response, NextFunction } from "express";
import { subDays, format } from "date-fns";
import Sequelize from "sequelize";
import * as config from "../../config";
import authMiddleware from "../../helpers/middlewares/auth-middleware";
import HttpException from "../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Listing, Location, UserProfile } from "../../models";

const Op = Sequelize.Op;

class ListingLegacyController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/listings`, authMiddleware, this.getAllListings);
    this.router.get(`/listings/count/hosts`, authMiddleware, this.getAllHosts);
    this.router.get(`/listings/count/hosts/date`, authMiddleware, this.getAllHostsByDate);
    this.router.get(`/listings/count/date`, authMiddleware, this.getAllListingsByDate);
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
        col: 'userId'
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
    const days = request.query.days || 10000
    const date = format(subDays(new Date(), days), "YYYY-MM-DD");
    try {
      const data = await Listing.count({
        where: {
          createdAt: { 
            [Op.gte]: `${date}`
          },
        },
        distinct: true,
        col: 'userId'
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
    const days = request.query.days || 10000
    const category = request.query.category || null
    const date = format(subDays(new Date(), days), "YYYY-MM-DD");
      
    const where = {
      where: { 
        createdAt: { 
          [Op.gte]: `${date}`
        },
      },
      raw: true
    }

    const whereCategory = {
      where: { 
        createdAt: { 
          [Op.gte]: `${date}`
        },
        listSettingsParentId: category
      },
      raw: true
    }
    
    try {
      const data = await Listing.count(category === 'null' ? where : whereCategory);
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  getAllListingsByCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {

    const category = request.query.category
    const where = { where: { listSettingsParentId: category }, raw: true }

    try {
      const data = await Listing.count(where);
      response.send({ count: data });
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
    
  };

}

export default ListingLegacyController;
