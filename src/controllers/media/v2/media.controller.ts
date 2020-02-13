import { Router, Request, Response, NextFunction } from "express";
import { uploadByMulter } from "../../../services/image.upload.service";
import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

class V2MediaController {
  private router = Router();

  constructor() {
    this.router.post(`/v2/media`, authMiddleware, this.postMedia);
  }

  postMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await uploadByMulter.single("file")(req, res, async err => {
        if (err) {
          throw new Error(`Problems during upload to S3 Bucket`);
        } else {
          const file: any = req.file;
          const photo = {
            name: file.Location,
            bucket: file.Bucket,
            region: "ap-southeast-2",
            type: file.mimetype,
            key: file.Key
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
