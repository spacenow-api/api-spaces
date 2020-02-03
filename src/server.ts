import { PORT } from "./config";

import App from "./App";

import CategoriesController from "./controllers/categories/category.controller";
import HealthController from "./controllers/health/health.controller";
import ListingController from "./controllers/listing/listing.controller";
import ListingSettingsController from "./controllers/listing/listingSettings.controller";
import ListingAmenities from "./controllers/listing/listingAmenities.controller";
import ListingRulesController from "./controllers/listing/listingRules.controller";
import ListingAccessDaysController from "./controllers/listing/listingAccessDays.controller";
import ListingPhotosController from "./controllers/listing/listingPhotos.controller";
import ListingReviews from "./controllers/listing/listingReviews.controller";
import ExternalClicks from "./controllers/listing/externalClicks.controller";
import LocationController from "./controllers/locations/location.controller";
import PhotosController from "./controllers/photos/legacyPhotos.controller";
import AddonsController from "./controllers/addons/addons.controller";

/**
 * V2 APIs
 */
import V2CategoryController from "./controllers/categories/v2/category.controller";
import V2ListingController from "./controllers/listing/v2/listing.controller";
import V2ListingStepsController from "./controllers/listing/v2/listingSteps.controller";
import V2LocationController from "./controllers/locations/v2/location.controller";

const app = new App(
  [
    new CategoriesController(),
    new HealthController(),
    new ListingController(),
    new ListingSettingsController(),
    new ListingAmenities(),
    new ListingRulesController(),
    new ListingAccessDaysController(),
    new ListingPhotosController(),
    new ListingReviews(),
    new ExternalClicks(),
    new LocationController(),
    new PhotosController(),
    new AddonsController(),

    /**
     * V2 APIs
     */
    new V2CategoryController(),
    new V2ListingController(),
    new V2ListingStepsController(),
    new V2LocationController()
  ],
  PORT,
  "0.0.0.0"
);

app.listen();
