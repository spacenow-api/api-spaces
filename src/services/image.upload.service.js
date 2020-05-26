const { Request } = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const s3Storage = require("multer-sharp-s3");

const config = require("../config");

const s3 = new AWS.S3();
const AWS_S3_BUCKET_NAME = config.bucket || "";
const options = { ACL: "public-read", s3, Bucket: `${AWS_S3_BUCKET_NAME}` };

const fileExtFilter = (request, file, callback) => {
  if (file.mimetype.includes("image/") || file.mimetype.includes('video/')) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type!"), false);
  }
}

const fileKey = (request, file, callback) => {
  let ext = 'jpeg';
  if (file.mimetype.includes('video'))
    ext = 'mp4';
  return callback(null, `/space-images/${request.params.id}/spacenow-${Date.now()}.${ext}`);
}

const uploadByMulter = multer({
  fileFilter: fileExtFilter,
  storage: s3Storage({ ...options, Key: fileKey })
})

export { uploadByMulter };
