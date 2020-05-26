const { Router, Request, Response, NextFunction } = require("express");

const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");
const HttpException = require("../../../helpers/exceptions/HttpException");

const { V2ListingSteps } = require("../../../models");

class ListingStepsController {
  router = Router();

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

  getListingSteps = async (req, res, next) => {
    const listingId = (req.params.id);
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
    req,
    res,
    next
  ) => {
    const listingId = (req.params.id);
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
