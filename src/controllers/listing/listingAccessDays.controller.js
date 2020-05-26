const { Router, Request, Response, NextFunction } = require("express");

const { authMiddleware } = require('../../helpers/middlewares/auth-middleware');
const HttpException = require("../../helpers/exceptions/HttpException");
const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { ListingAccessDays, ListingAccessHours } = require("../../models");

class ListingAccessDaysController {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    /**
     * Get listing Access Days and Hours by listing ID.
     */
    this.router.get(`/listings/access/:listingId`, async (req, res, next) => {
      try {
        const daysObj = await ListingAccessDays.findOne(
          {
            where: { listingId: req.params.listingId },
            raw: true
          }
        );
        if (daysObj) {
          const hoursArray = await ListingAccessHours.findAll({
            where: { listingAccessDaysId: daysObj.id },
            raw: true
          });
          res.send({ ...daysObj, listingAccessHours: hoursArray });
        } else {
          next(
            new HttpException(
              400,
              `Listing ${req.params.listingId} not found.`
            )
          );
        }
      } catch (err) {
        console.error(err);
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingAccessDaysController;
