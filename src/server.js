const { PORT } = require('./config');

const App = require('./App');

const CategoriesController = require('./controllers/categories/category.controller');
const HealthController = require('./controllers/health/health.controller');
const ListingController = require('./controllers/listing/listing.controller');
const ListingSettingsController = require('./controllers/listing/listingSettings.controller');
const ListingAmenities = require('./controllers/listing/listingAmenities.controller');
const ListingRulesController = require('./controllers/listing/listingRules.controller');
const ListingAccessDaysController = require('./controllers/listing/listingAccessDays.controller');
const ListingPhotosController = require('./controllers/listing/listingPhotos.controller');
const ListingReviews = require('./controllers/listing/listingReviews.controller');
const ExternalClicks = require('./controllers/listing/externalClicks.controller');
const LocationController = require('./controllers/locations/location.controller');
const PhotosController = require('./controllers/photos/legacyPhotos.controller');
const InspectionController = require('./controllers/inspection/inspection.controller');
const AddonsController = require('./controllers/addons/addons.controller');
const SavedListingsController = require('./controllers/savedListings/savedListings.controller');

/**
 * V2 APIs
 */
const V2CategoryController = require('./controllers/categories/v2/category.controller');
const V2ListingController = require('./controllers/listing/v2/listing.controller');
const V2ListingStepsController = require('./controllers/listing/v2/steps.controller');
const V2LocationController = require('./controllers/locations/v2/location.controller');
const V2RuleController = require('./controllers/listing/v2/rule.controller');
const V2AmenityController = require('./controllers/listing/v2/amenity.controller');
const V2FeatureController = require('./controllers/listing/v2/feature.controller');
const V2ConcellationController = require('./controllers/listing/v2/cancellation.controller');
const V2MediaController = require('./controllers/media/v2/media.controller');
const V2TagController = require('./controllers/tag/v2/tag.controller');

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
    new InspectionController(),
    new AddonsController(),
    new SavedListingsController(),

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
  '0.0.0.0'
)

app.listen()
