import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import NodeCache from "node-cache";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

import { V2Location, UniqueLocation } from "../../../models";
import GoogleGEOCode from "../../../helpers/utils/googleGeoCode";

const cacheKeys = {
  BY_ID: "_location_by_id_"
};

const getHash = (suggestAddress: string, userId: string = "") => {
  const stringReference: string = suggestAddress + userId;
  return crypto
    .createHash("sha256")
    .update(stringReference, "utf8")
    .digest("base64");
};

class V2LocationController {
  private router = Router();

  private cache: NodeCache = new NodeCache();

  constructor() {
    this.router.get("/v2/location/:id", this.getLocation);
    this.router.post("/v2/location", authMiddleware, this.postLocation);
  }

  getLocation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const cacheKey = `${cacheKeys.BY_ID}${id}`;
    try {
      const cacheData = this.cache.get(cacheKey);
      if (cacheData) res.send(cacheData);

      const locationObj = await V2Location.findByPk(id);
      this.cache.set(cacheKey, JSON.parse(JSON.stringify(locationObj)));
      res.send(locationObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postLocation = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    if (!data || !data.suggestAddress) {
      throw new HttpException(400, "A reference address must be provided.");
    }
    try {
      const id = getHash(data.suggestAddress, req.userIdDecoded);
      const uniLocationObj = await UniqueLocation.findByPk(id);

      if (uniLocationObj)
        res.send(
          await V2Location.findOne({
            where: { id: uniLocationObj.locationId }
          })
        );

      try {
        let geoAddress = await GoogleGEOCode.getGoogleGEOCode(
          data.suggestAddress
        );
        const { dataValues }: any = await V2Location.create({
          ...geoAddress,
          userId: req.userIdDecoded,
          buildingName: data.unit,
          placeId: data.placeId
        });
        await UniqueLocation.create({
          id,
          locationId: dataValues.id
        });
        res.send({ ...dataValues });
      } catch (err) {
        throw new HttpException(
          400,
          `Address ${data.suggestAddress} not found by Google API.`
        );
      }
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2LocationController;
