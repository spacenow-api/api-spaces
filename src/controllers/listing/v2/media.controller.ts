import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";

import { V2ListingPhotos } from "../../../models";

class ListingStepsController {
  private router = Router();

  constructor() {
    this.router.post(
      `/v2/listing/:id/media`,
      authMiddleware,
      this.postListingMedia
    );
  }

  postListingMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const listingId = <string>(<unknown>req.params.id);
    const data = req.body;
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    try {
      res.send(await V2ListingPhotos.create({ listingId, ...data }));
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default ListingStepsController;
