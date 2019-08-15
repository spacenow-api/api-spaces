import { Router, Request, Response, NextFunction } from "express";
import * as config from "../../config";
import authMiddleware from "../../helpers/middlewares/auth-middleware";
import HttpException from "../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Listing, Location } from "../../models";

class ListingLegacyController {
  private router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(`/listings`, authMiddleware, this.getAllListings);
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
}

export default ListingLegacyController;
