import { Router, Request, Response, NextFunction } from "express";
import * as AWS from "aws-sdk";
import * as config from "../../../config";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";
import { V2ListingPhotos } from "../../../models";

const s3 = new AWS.S3();
const AWS_S3_BUCKET_NAME = config.bucket || "";

class V2MediaController {
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
    console.log("LISTING ID ===>>>", listingId);

    const data = req.body;
    if (!listingId) {
      throw new HttpException(400, `Listing ID must be provided.`);
    }

    console.log("DATA ===>>>", data);

    let ext = "jpeg";
    if (data.category === "video") ext = "mp4";
    const key = `/space-images/${listingId}/spacenow-${Date.now()}.${ext}`;

    var params = {
      Body: new Buffer(
        data.file.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
      ContentEncoding: "base64",
      ContentType: "image/webp",
    };

    s3.putObject(params, async (err) => {
      if (err) sequelizeErrorMiddleware(err, req, res, next);
      try {
        res.send(
          await V2ListingPhotos.create({
            listingId,
            category: data.category,
            name: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
          })
        );
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next);
      }
    });
  };
}

export default V2MediaController;
