const { Router } = require("express");
const crypto = require("crypto");
const NodeCache = require("node-cache");
const axios = require("axios");
const { googleMapAPI } = require("../../../config");

const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const HttpException = require("../../../helpers/exceptions/HttpException");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");

const { V2Location, UniqueLocation } = require("../../../models");

const cacheKeys = {
  BY_ID: "_location_by_id_"
};

const getHash = (suggestAddress, userId = "") => {
  const stringReference = suggestAddress + userId;
  return crypto
    .createHash("sha256")
    .update(stringReference, "utf8")
    .digest("base64");
};

class V2LocationController {
  router = Router();

  cache = new NodeCache();

  constructor() {
    this.router.get("/v2/location/:id", this.getLocation);
    this.router.post("/v2/location", authMiddleware, this.postLocation);
  }

  getLocation = async (req, res, next) => {
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

  postLocation = async (req, res, next) => {
    const data = req.body;
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

    let geoAddress;
      try {
        geoAddress = await this.getGoogleGeoCodeAddress(
          data.address
        );
      } catch (err) {
        throw new HttpException(
          400,
          `Address ${data.address} not found by Google API.`
        );
      }
      try {
        console.log("LOCATION FROM GOOGLE", geoAddress)
        const { dataValues } = await V2Location.create({
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
        console.log(err)
        sequelizeErrorMiddleware(err, req, res, next);
      }
  };

  getGoogleGeoCodeAddress = async (suggestAddress) => {
    const URL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(suggestAddress) + "&key=" + googleMapAPI;
    const resp = await axios.get(URL);
    const geoData = await resp.data;
    const locationData = {};
    if (geoData && geoData.results && geoData.results.length > 0) {
      geoData.results.map((item) => {
        item.address_components.map((value) => {
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
        address1,
        buildingName,
        country: locationData.country,
        city,
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
