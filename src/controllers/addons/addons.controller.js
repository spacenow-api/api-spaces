const { Router, Request, Response, NextFunction } = require("express");

const { sequelize } = require("./../../helpers/database/sequelize");
const sequelizeErrorMiddleware = require("./../../helpers/middlewares/sequelize-error-middleware");
const { authMiddleware, authAdminMiddleware } = require("./../../helpers/middlewares/auth-middleware");
const { slugify } = require("./../../helpers/utils/strings");

const {
  Listing,
  ListSettings,
  Bookings,
  AddonsBooking,
  AddonsListing,
  AddonsSubCategorySuggestions
} = require("./../../models");

class AddonsController {

  router = Router();

  constructor() {
    this.router.get("/addons/listing/:listingId", authMiddleware, this.fetchAddonsByListing);
    this.router.post("/addons/listing", authMiddleware, this.createAddon);
    this.router.delete("/addons/listing/:id", authMiddleware, this.deleteAddon);
    this.router.get("/addons/suggestion/:listSettingsId", authAdminMiddleware, this.fetchAddonsBySubCategory);
    this.router.post("/addons/suggestion", authAdminMiddleware, this.createAddonSuggestion);
    this.router.delete("/addons/suggestion/:id", authAdminMiddleware, this.deleteAddonSuggestion);
    this.router.get("/addons/booking/:bookingId", authMiddleware, this.fetchAddonsByBooking);
    this.router.put("/addons/booking/set", authMiddleware, this.setAddonOnBooking);
    this.router.put("/addons/booking/remove", authMiddleware, this.removeAddonFromBooking);
  }

  fetchAddonsByListing = async (req, res, next) => {
    try {
      const addons = await AddonsListing.findAll({
        where: { listingId: req.params.listingId }
      });
      res.send(addons);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  createAddon = async (req, res, next) => {
    try {
      const { listingId, description, value } = req.body;
      if (!value || value <= 0)
        throw new Error("Value must be greater than zero.");
      if (!description)
        throw new Error("Description is missing.");
      const count = await Listing.count({ where: { id: listingId } });
      if (count <= 0)
        throw new Error(`Listing ${listingId} not found.`);
      const key = this.keyByDescription(description);
      const existingAddon = await AddonsListing.findOne({
        where: { listingId, key }
      });
      if (existingAddon) {
        res.send(existingAddon);
      } else {
        const addonsListing = await AddonsListing.create({
          listingId, description, key, value
        });
        res.send(addonsListing);
      }
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  deleteAddon = async (req, res, next) => {
    try {
      const { id } = req.params;
      const addonObj = await AddonsListing.findOne({ where: { id } });
      if (!addonObj)
        throw new Error(`Addon ${id} not found.`);
      const bookingsCount = await AddonsBooking.count({ where: { addonId: id } });
      if (bookingsCount > 0)
        throw new Error(`Addon ${id} has already been used in Bookings.`);
      await AddonsListing.destroy({ where: { id } });
      console.info(`Addon ${id} removed by User ${req.userIdDecoded}.`);
      res.send(addonObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  fetchAddonsBySubCategory = async (req, res, next) => {
    try {
      const addons = await AddonsSubCategorySuggestions.findAll({
        where: { listSettingsId: req.params.listSettingsId }
      });
      res.send(addons);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  createAddonSuggestion = async (req, res, next) => {
    try {
      const { listSettingsId, description } = req.body;
      const count = await ListSettings.count({ where: { id: listSettingsId } });
      if (count <= 0) {
        throw new Error(`List Settings ${listSettingsId} not found.`);
      }
      const key = this.keyByDescription(description);
      const existingAddon = await AddonsSubCategorySuggestions.findOne({
        where: { listSettingsId, key }
      });
      if (existingAddon) {
        res.send(existingAddon);
      } else {
        const addonsSuggestion = await AddonsSubCategorySuggestions.create({
          listSettingsId, description, key
        });
        res.send(addonsSuggestion);
      }
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  deleteAddonSuggestion = async (req, res, next) => {
    try {
      const { id } = req.params;
      const suggestionObj = await AddonsSubCategorySuggestions.findOne({ where: { id } });
      if (!suggestionObj)
        throw new Error(`Addon Suggestion ${id} not found.`);
      const listingsUsingCount = await AddonsListing.count({
        where: { key: suggestionObj.key }
      });
      if (listingsUsingCount > 0)
        throw new Error(`There are few listings using this Addon Suggestion.`);
      await AddonsSubCategorySuggestions.destroy({ where: { id } });
      console.info(`Addon Suggestion ${id} removed by User ${req.userIdDecoded}.`);
      res.send(suggestionObj);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  fetchAddonsByBooking = async (req, res, next) => {
    try {
      const addonsByBooking = await AddonsBooking.findAll({
        where: { bookingId: req.params.bookingId }
      });
      const addons = await Promise.all(addonsByBooking.map(async (o) =>
        await AddonsListing.findOne({ where: { id: o.addonId } })));
      res.send(addons);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  setAddonOnBooking = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { bookingId, addonId } = req.body;
      const bookingObj = await Bookings.findOne({ where: { bookingId } });
      if (!bookingObj)
        throw new Error(`Booking ${bookingId} not found.`);
      const addonObj = await AddonsListing.findOne({ where: { id: addonId } });
      if (!addonObj)
        throw new Error(`Addon ${addonId} not found.`);
      const addonsCount = await AddonsBooking.count({ where: { bookingId, addonId } });
      if (addonsCount > 0)
        throw new Error('Addon already setted for this Booking.');
      await AddonsBooking.create(
        { bookingId, addonId },
        { transaction: t }
      );
      const bookingTotalUpdated = bookingObj.totalPrice + addonObj.value;
      console.info(`Booking ${bookingId} [totalPrice] updated to ${bookingTotalUpdated} by User ${req.userIdDecoded}.`);
      await Bookings.update(
        { totalPrice: bookingTotalUpdated, updatedAt: new Date() },
        { where: { bookingId }, transaction: t }
      );
      await t.commit();
      const addonsByBooking = await AddonsBooking.findAll({ where: { bookingId } });
      const addons = await Promise.all(addonsByBooking.map(async (o) =>
        await AddonsListing.findOne({ where: { id: o.addonId } })));
      res.send(addons);
    } catch (err) {
      await t.rollback();
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  removeAddonFromBooking = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { bookingId, addonId } = req.body;
      const bookingObj = await Bookings.findOne({ where: { bookingId } });
      if (!bookingObj)
        throw new Error(`Booking ${bookingId} not found.`);
      const addonObj = await AddonsListing.findOne({ where: { id: addonId } });
      if (!addonObj)
        throw new Error(`Addon ${addonId} not found.`);
      const addonBookingObj = await AddonsBooking.findOne({ where: { bookingId, addonId } });
      if (!addonBookingObj)
        throw new Error('Addon not attached for this Booking.');
      await AddonsBooking.destroy(
        { where: { bookingId, addonId }, transaction: t }
      );
      const bookingTotalUpdated = bookingObj.totalPrice - addonObj.value;
      console.info(`Booking ${bookingId} [totalPrice] updated to ${bookingTotalUpdated} by User ${req.userIdDecoded}.`);
      await Bookings.update(
        { totalPrice: bookingTotalUpdated, updatedAt: new Date() },
        { where: { bookingId }, transaction: t }
      );
      await t.commit();
      const addonsByBooking = await AddonsBooking.findAll({ where: { bookingId } });
      const addons = await Promise.all(addonsByBooking.map(async (o) =>
        await AddonsListing.findOne({ where: { id: o.addonId } })));
      res.send(addons);
    } catch (err) {
      await t.rollback();
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  keyByDescription = (description) => {
    if (!description || description.length == 0)
      throw new Error('Add-on needs a description.');
    const key = slugify(description, "_");
    return key.toUpperCase();
  }

}

export default AddonsController;