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
import V2ListingStepsController from "./controllers/listing/v2/steps.controller";
import V2LocationController from "./controllers/locations/v2/location.controller";
import V2RuleController from "./controllers/listing/v2/rule.controller";
import V2AmenityController from "./controllers/listing/v2/amenity.controller";
import V2FeatureController from "./controllers/listing/v2/feature.controller";
import V2ConcellationController from "./controllers/listing/v2/cancellation.controller";
import V2MediaController from "./controllers/media/v2/media.controller";
import V2TagController from "./controllers/tag/v2/tag.controller";

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
    new V2LocationController(),
    new V2RuleController(),
    new V2AmenityController(),
    new V2FeatureController(),
    new V2ConcellationController(),
    new V2MediaController(),
    new V2TagController()
  ],
  PORT,
  "0.0.0.0"
);

app.listen();
