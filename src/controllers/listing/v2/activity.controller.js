const { Router, Request, Response, NextFunction } = require("express");

const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");

const { V2ListingActivities } = require("../../../models/v2");

class V2AmenityController {
  router = Router();

  constructor() {
    this.router.post(
      `/v2/listing/:id/activity`,
      authMiddleware,
      this.postActivity
    );
  }

  postActivity = async (req, res, next) => {
    const listingId = (req.params.id);
    const data = req.body;
    try {
      res.send(
        await V2ListingActivities.create({
          listingId,
          activityId: data.activityId
        })
      );
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2AmenityController;
