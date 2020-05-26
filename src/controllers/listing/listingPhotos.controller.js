const { Router } = require("express");

const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { ListingPhotos } = require("../../models");
const { Op } = require("sequelize");

class ListingPhotosController {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    /**
     * Get listing Photos by listing ID.
     */
    this.router.get("/listings/photos/:listingId", async (req, res, next) => {
      try {
        const photosArray = await ListingPhotos.findAll({
          where: {
            listingId: req.params.listingId,
            type: { [Op.like]: "image/%" }
          }
        });
        res.send(photosArray);
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Get an unique Video by a Listing.
     */
    this.router.get("/listings/video/:listingId", async (req, res, next) => {
      try {
        const videoObj = await ListingPhotos.findOne({
          where: { listingId: req.params.listingId, type: "video/mp4" },
          limit: 1
        });
        res.send(videoObj);
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Get an unique Floorplan by a Listing.
     */
    this.router.get("/listings/floorplan/:listingId", async (req, res, next) => {
      try {
        const obj = await ListingPhotos.findOne({
          where: { listingId: req.params.listingId, type: { [Op.like]: "image/%" }, category: "floorplan" },
          limit: 1
        });
        res.send(obj);
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });

    /**
     * Get an unique Video by a Listing.
     */
    this.router.get("/listings/menu/:listingId", async (req, res, next) => {
      try {
        const obj = await ListingPhotos.findOne({
          where: { listingId: req.params.listingId, category: "menu" },
          limit: 1
        });
        res.send(obj);
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  }
}

export default ListingPhotosController;
