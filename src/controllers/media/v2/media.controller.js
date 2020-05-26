const { Router, Request, Response, NextFunction } = require("express");
const { uploadByMulter } = require("../../../services/image.upload.service");
const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");

class V2MediaController {
  router = Router();

  constructor() {
    this.router.post(`/v2/media/:id`, authMiddleware, this.postMedia);
  }

  postMedia = async (req, res, next) => {
    try {
      await uploadByMulter.single("file")(req, res, async err => {
        if (err) {
          throw new Error(`Problems during upload to S3 Bucket`);
        } else {
          const file = req.file;
          const photo = {
            name: file.Location,
            bucket: file.Bucket,
            region: "ap-southeast-2",
            type: file.mimetype,
            key: file.Key,
            category: req.body.category
          };
          res.send(photo);
        }
      });
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2MediaController;
