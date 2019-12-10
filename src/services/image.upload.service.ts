import { Request } from "express";
import * as AWS from "aws-sdk";
import multer from "multer";
import s3Storage from "multer-sharp-s3";

import * as config from "../config";

const s3 = new AWS.S3();
const AWS_S3_BUCKET_NAME = config.bucket || "";
const options = { ACL: "public-read", s3, Bucket: `${AWS_S3_BUCKET_NAME}` };

const fileExtFilter = (request: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void): void => {
  if (file.mimetype.includes("image/") || file.mimetype.includes('video/')) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type!"), false);
  }
}

const fileKey = (request: Request, file: any, callback: (error: any, metadata?: any) => void): void => {
  let ext = 'jpeg';
  if (file.mimetype.includes('video'))
    ext = 'mp4';
  return callback(null, `/space-images/${request.params.listingId}/spacenow-${Date.now()}.${ext}`);
}

const uploadByMulter = multer({
  fileFilter: fileExtFilter,
  storage: s3Storage({ ...options, Key: fileKey })
})

export { uploadByMulter };
