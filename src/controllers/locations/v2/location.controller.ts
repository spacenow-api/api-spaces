import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import NodeCache from "node-cache";
import axios from "axios";
import { googleMapAPI } from "../../../config";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

import { V2Location, UniqueLocation } from "../../../models";

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
    let geoAddress = null;
    if (!data || !data.address) {
      throw new HttpException(400, "A reference address must be provided.");
    }

    const id = getHash(data.address, req.userIdDecoded);
    const uniLocationObj = await UniqueLocation.findByPk(id);
    if (uniLocationObj)
      res.send(
        await V2Location.findOne({
          where: { id: uniLocationObj.locationId }
        })
      );

    try {
      geoAddress = await V2LocationController.getGoogleGeoCodeAddress(data.address);
    } catch (err) {
      next(new HttpException(400, `Address ${data.address} not found by Google API.`));
    }

    try {
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
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  static async getGoogleGeoCodeAddress(suggestAddress: string): Promise<any> {
    const URL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(suggestAddress) + "&key=" + googleMapAPI;
    const {
      data: { geoData }
    } = await axios.get(URL);
    const locationData: any = {};
    if (geoData && geoData.results && geoData.results.length > 0) {
      geoData.results.map((item: any) => {
        item.address_components.map((value: any) => {
          if (value.types[0] == "administrative_area_level_1" || value.types[0] == "country") {
            locationData[value.types[0]] = value.short_name;
          } else {
            locationData[value.types[0]] = value.long_name;
          }
        });
      });
      const city = locationData.locality != undefined ? locationData.locality : locationData.administrative_area_level_2;
      const buildingName = (locationData.subpremise != undefined ? locationData.subpremise : "") + " " + (locationData.premise != undefined ? locationData.premise : "");
      const address1 = locationData.street_number ? locationData.street_number + " " + locationData.route : locationData.route;
      return Promise.resolve({
        address1: address1,
        buildingName: buildingName,
        country: locationData.country,
        city: city,
        state: locationData.administrative_area_level_1,
        zipcode: locationData.postal_code,
        lat: geoData.results[0].geometry.location.lat,
        lng: geoData.results[0].geometry.location.lng
      });
    } else {
      return Promise.reject();
    }
  }
}

export default V2LocationController;
