import { PORT } from "./config";

import App from "./App";

import CategoriesController from "./controllers/legacy/category.controller";
import HealthController from "./controllers/health/health.controller";
import ListingLegacyController from "./controllers/listing/listing.controller";
import ListingController from "./controllers/listing/listing.controller";
import ListingSettingsController from "./controllers/listing/listingSettings.controller";
import ListingAmenities from "./controllers/listing/listingAmenities.controller";
import ListingRulesController from "./controllers/listing/listingRules.controller";
import ListingAccessDaysController from "./controllers/listing/listingAccessDays.controller";
import ListingPhotosController from "./controllers/listing/listingPhotos.controller";
import ListingReviews from "./controllers/listing/listingReviews.controller";
import ExternalClicks from "./controllers/listing/externalClicks.controller";

const app = new App(
  [
    new CategoriesController(),
    new HealthController(),
    new ListingLegacyController(),
    new ListingController(),
    new ListingSettingsController(),
    new ListingAmenities(),
    new ListingRulesController(),
    new ListingAccessDaysController(),
    new ListingPhotosController(),
    new ListingReviews(),
    new ExternalClicks()
  ],
  PORT,
  "0.0.0.0"
);

app.listen();
