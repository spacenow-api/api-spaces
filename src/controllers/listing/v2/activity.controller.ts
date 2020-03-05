import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

import { V2ListingActivity } from "../../../models/v2";

class V2AmenityController {
  private router = Router();

  constructor() {
    this.router.post(`/v2/listing/:id/activity`, authMiddleware, this.postActivity);
  }

  postActivity = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <number>(<unknown>req.params.id);
    const data = req.body;
    try {
      res.send(await V2ListingActivity.create({ listingId, activityId: data.activityId }));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2AmenityController;
