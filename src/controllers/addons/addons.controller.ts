import { Router, Request, Response, NextFunction } from "express";

import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";
import { slugify } from "./../../helpers/utils/strings";

import {
  Listing,
  AddonsBooking,
  AddonsListing,
  AddonsSubCategorySuggestions
} from "./../../models";

class AddonsController {

  private router: Router = Router();

  /**
    1. fetchAddonsByListing(listingId): [AddonsListing] #api-spaces
    2. createAddon(listingId, description, value) #api-spaces
    3. deleteAddon(id) #api-spaces
    4. fetchAddonsBySubCategory(listSettingsId): [AddonsSubCategorySuggestions] #api-spaces
    5. createAddonSuggestion(listSettingsId, description) #api-spaces
    6. deleteAddonSuggestion(id) #api-spaces
    7. setAddonOnBooking(bookingId, addonId) #api-spaces
    8. removeAddonFromBooking(bookingId, addonId) #api-spaces
   */
  constructor() {
    this.router.get("/addons/listing/:listingId", this.fetchAddonsByListing);
    this.router.post("/addons", this.createAddon);
    this.router.delete("/addons", this.deleteAddon);
    this.router.get("/addons/category/:listSettingsId", this.fetchAddonsBySubCategory);
    this.router.post("/addons/suggestion", this.createAddonSuggestion);
    this.router.delete("/addons/suggestion", this.deleteAddonSuggestion);
    this.router.put("/addons/booking/set", this.setAddonOnBooking);
    this.router.put("/addons/booking/remove", this.removeAddonFromBooking);
  }

  private fetchAddonsByListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addons = await AddonsListing.findAll({
        where: { listingId: req.params.listingId }
      });
      res.send(addons);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private createAddon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listingId, description, value } = req.body;
      const count = await Listing.count({ where: { id: listingId } });
      if (count <= 0) {
        throw new Error(`Listing ${listingId} not found.`);
      }
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

  private deleteAddon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private fetchAddonsBySubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addons = await AddonsSubCategorySuggestions.findAll({
        where: { listSettingsId: req.params.listSettingsId }
      });
      res.send(addons);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private createAddonSuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private deleteAddonSuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private setAddonOnBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private removeAddonFromBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private keyByDescription = (description: string) => {
    if (!description || description.length == 0)
      throw new Error('Add-on needs a description.');
    const key = slugify(description, "_");
    return key;
  }

}

export default AddonsController;