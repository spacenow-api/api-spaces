import { Router, Request, Response, NextFunction } from "express";
import { subDays, format } from "date-fns";
import * as config from "../../config";
import authMiddleware from "../../helpers/middlewares/auth-middleware";
import HttpException from "../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Listing, Location, UserProfile } from "../../models";

class ListingLegacyController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/listings`, authMiddleware, this.getAllListings);
    this.router.get(`/listings/count/hosts`, authMiddleware, this.getAllHosts);
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

  getAllListingsByDate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const days = request.query.days
    const sudDays = subDays(new Date(), days)
    console.log(subDays);
    const where = { 
      where: { 
        createdAt: { $gte: `${sudDays}` }
      } 
    }
    try {
      const data = await Listing.count(where);
      response.send(data);
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  // getAllListingsByCategory = async (
  //   request: Request,
  //   response: Response,
  //   next: NextFunction
  // ) => {

  //   const where = { where: { listSettingsParentId } }
  //   const data = await Listing.count(where);

  //   return response.send(data);
  // };

}

export default ListingLegacyController;
