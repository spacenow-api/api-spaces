const { Router } = require("express");
const crypto = require("crypto");
const axios = require("axios");
const NodeCache = require("node-cache");

const { authMiddleware } = require("./../../helpers/middlewares/auth-middleware");
const HttpException = require("../../helpers/exceptions/HttpException");
const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { Location, UniqueLocation, Listing } = require("../../models");

const config = require("../../config");

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

class LocationController {
  router = Router();

  cache = new NodeCache();

  constructor() {
    this.router.get("/locations/:id", this.getLocationById);
    this.router.get(
      "/locations/count/listings",
      authMiddleware,
      this.getLocationsCountListings
    );
    this.router.post("/locations", authMiddleware, this.postNewLocation);
  }

  getLocationById = async (req, res, next) => {
    const cacheKey = `${cacheKeys.BY_ID}${req.params.id}`;
    try {
      const cacheData = this.cache.get(cacheKey);
      if (cacheData) {
        res.send(cacheData);
        return;
      }
      const locationObj = await Location.findOne({
        where: { id: req.params.id }
      });
      this.cache.set(cacheKey, JSON.parse(JSON.stringify(locationObj)));
      res.send(locationObj);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

   async postNewLocation(
    req,
    res,
    next
  ) {
    const data = req.body;
    try {
      if (!data || !data.suggestAddress) {
        throw new HttpException(400, "A reference address must be provided.");
      }
      const hash = getHash(data.suggestAddress, req.userIdDecoded);
      const uniLocationObj = await UniqueLocation.findOne({
        where: { id: hash }
      });
      if (uniLocationObj) {
        const locationObj = await Location.findOne({
          where: { id: uniLocationObj.locationId }
        });
        res.send(locationObj);
      } else {
        // Creating a new location from Google API data...
        let geoAddress;
        try {
          geoAddress = await LocationController.getGoogleGeoCodeAddress(
            data.suggestAddress
          );
        } catch (err) {
          console.error(err);
          throw new HttpException(
            400,
            `Address ${data.suggestAddress} not found by Google API.`
          );
        }
        const { dataValues } = await Location.create({
          ...geoAddress,
          userId: req.userIdDecoded,
          buildingName: data.unit,
          placeId: data.placeId
        });
        await UniqueLocation.create({
          id: hash,
          locationId: dataValues.id
        });
        res.send({ ...dataValues });
      }
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  static async getGoogleGeoCodeAddress(
    suggestAddress
  ) {
    const URL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      encodeURI(suggestAddress) +
      "&key=" +
      config.googleMapAPI;
    const resp = await axios.get(URL);
    const geoData = await resp.data;
    const locationData = {};
    if (geoData && geoData.results && geoData.results.length > 0) {
      geoData.results.map(item => {
        item.address_components.map(value => {
          if (
            value.types[0] == "administrative_area_level_1" ||
            value.types[0] == "country"
          ) {
            locationData[value.types[0]] = value.short_name;
          } else {
            locationData[value.types[0]] = value.long_name;
          }
        });
      });
      const city =
        locationData.locality != undefined
          ? locationData.locality
          : locationData.administrative_area_level_2;
      const buildingName =
        (locationData.subpremise != undefined ? locationData.subpremise : "") +
        " " +
        (locationData.premise != undefined ? locationData.premise : "");
      const address1 = locationData.street_number
        ? locationData.street_number + " " + locationData.route
        : locationData.route;
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

  getLocationsCountListings = async (
    request,
    response,
    next
  ) => {
    var listingsLocations = new Array();

    let where = {
      attributes: ["state"],
      group: ["state"],
      where: { country: "AU" }
    };

    const locations = await Location.findAll(where);
    for (const location of locations) {
      const where = {
        include: [
          {
            model: Location,
            as: "location",
            attributes: ["state"],
            where: {
              state: location.state || ""
            }
          }
        ]
      };

      const all = await Listing.count(where);
      const active = await Listing.count({
        ...where,
        where: { status: "active" }
      });
      const deleted = await Listing.count({
        ...where,
        where: { status: "deleted" }
      });
      const published = await Listing.count({
        ...where,
        where: { isPublished: true }
      });

      listingsLocations.push({
        state: location.state,
        count: { all, active, deleted, published }
      });
    }

    response.send(listingsLocations);
  };
}

export default LocationController;
