const { Router, Request, Response, NextFunction } = require("express");

const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");
const HttpException = require("../../helpers/exceptions/HttpException");

const { ListingPhotos, Listing } = require("../../models");

const { uploadByMulter } = require("../../services/image.upload.service");

class LegacyPhotosController {
   path = "/photos";

  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get(`${this.path}/:listingId`, this.getPhotos);
    this.router.post(`${this.path}/:listingId`, this.createListingPhotos);
    this.router.delete(`${this.path}/:listingId/:photoId`, this.deleteListingPhoto);
    this.router.put(`${this.path}/:listingId/:photoId`, this.setListingPhotoCover);
    this.router.post(`${this.path}/upload/:listingId`, this.uploadListingPhotoAndVideo);
  }

  getPhotos = async (request, response, next) => {
    try {
      const lId = request.params.listingId;
      const photos = await ListingPhotos.findAll({ where: { id: lId } });
      response.send(photos);
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  createListingPhotos = async (request, response, next) => {
    try {
      const data = request.body;
      const photo = await ListingPhotos.create(data);
      response.send(photo);
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  setListingPhotoCover = async (request, response, next) => {
    try {
      await ListingPhotos.update({ isCover: 0 }, { where: { listingId: request.params.listingId } });
      await ListingPhotos.update({ isCover: 1 }, { where: { id: request.params.photoId } });
      response.status(200).send("Cover Photo Updated");
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  deleteListingPhoto = async (request, response, next) => {
    try {
      const where = { id: request.params.photoId };
      const photoObj = await ListingPhotos.findOne({ where });
      if (!photoObj) throw new HttpException(400, "A Photo must exist.");
      await ListingPhotos.destroy({ where });
      response.status(200).send("Photo Deleted");
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  };

  uploadListingPhotoAndVideo = async (request, response, next) => {
    try {
      const where = { id: request.params.listingId };
      const listingObj = await Listing.findOne({ where });
      if (!listingObj) {
        throw new HttpException(400, "A Listing must exist.");
      }
      await uploadByMulter.single("file")(request, response, async error => {
        if (error) {
          console.error("Problems during upload to S3 Bucket: ", error);
          response.status(400).send(error);
        } else {
          const file = request.file;
          const category = request.body.category;
          try {
            const photo = await ListingPhotos.create({
              listingId: parseInt(request.params.listingId),
              name: file.Location,
              bucket: file.Bucket,
              region: "ap-southeast-2",
              type: file.mimetype,
              key: file.Key,
              category
            });
            response.send(photo);
          } catch (err) {
            response.status(400).send(err);
          }
        }
      });
    } catch (err) {
      response.status(400).send(err);
    }
  };
}

export default LegacyPhotosController;
