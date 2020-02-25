import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";

import { V2ListingSteps } from "../../../models";

class ListingStepsController {
  private router = Router();

  constructor() {
    this.router.get(
      `/v2/listing/:id/steps`,
      authMiddleware,
      this.getListingSteps
    );
    this.router.patch(
      `/v2/listing/:id/steps`,
      authMiddleware,
      this.updateListingSteps
    );
  }

  getListingSteps = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = <string>(<unknown>req.params.id);
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }
    try {
      const stepObj = await V2ListingSteps.findOne({ where: { listingId } });
      if (!stepObj) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      res.send(stepObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  updateListingSteps = async (
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
      const step = await V2ListingSteps.findOne({ where: { listingId } });
      if (!step) {
        throw new HttpException(400, `Listing ${listingId} not found.`);
      }
      await step.update(data, { individualHooks: true });
      res.send(await step.reload());
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default ListingStepsController;
