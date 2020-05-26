const { V2Listing } = require("./listing.model");
const { V2ListingAccessDays } = require("./listingAccessDays.model");
const { V2ListingAccessHours } = require("./listingAccessHours.model");
const { V2ListingData } = require("./listingData.model");
const { V2ListingPhotos } = require("./listingPhotos.model");
const { V2ListingSteps } = require("./listingSteps.model");
const { V2ListingRules } = require("./listingRules.model");
const { V2ListingAmenities } = require("./listingAmenities.model");
const { V2ListingFeatures } = require("./listingFeatures.model");
const { V2ListingExceptionDates } = require("./listingExceptionDates.model");
const { V2ListingActivities } = require("./listingActivities.model");
const { V2ListingAccess } = require("./listingAccess.model");
const { V2ListingStyles } = require("./listingStyles.model");
const { V2Category } = require("./category.model");
const { V2ListingTag } = require("./listingTag.model");
const { V2CategorySpecification } = require("./categorySpecification.model");
const { V2Location } = require("./location.model");
const { V2UniqueLocation } = require("./uniqueLocation.model");
const { V2Rule } = require("./rule.model");
const { V2Amenity } = require("./amenity.model");
const { V2Feature } = require("./feature.model");
const { V2Cancellation } = require("./cancellation.model");
const { V2Tag } = require("./tag.model");

export {
  V2Category,
  V2ListingTag,
  V2CategorySpecification,
  V2Listing,
  V2ListingAccessDays,
  V2ListingAccessHours,
  V2ListingData,
  V2ListingPhotos,
  V2ListingSteps,
  V2ListingAmenities,
  V2ListingRules,
  V2ListingFeatures,
  V2ListingExceptionDates,
  V2ListingActivities,
  V2ListingAccess,
  V2ListingStyles,
  V2Location,
  V2UniqueLocation,
  V2Rule,
  V2Amenity,
  V2Feature,
  V2Cancellation,
  V2Tag
};

export const arrayOfModels = [
  V2Category,
  V2ListingTag,
  V2CategorySpecification,
  V2Listing,
  V2ListingAccessDays,
  V2ListingAccessHours,
  V2ListingData,
  V2ListingPhotos,
  V2ListingSteps,
  V2ListingAmenities,
  V2ListingRules,
  V2ListingFeatures,
  V2ListingExceptionDates,
  V2ListingActivities,
  V2ListingAccess,
  V2ListingStyles,
  V2Location,
  V2UniqueLocation,
  V2Rule,
  V2Amenity,
  V2Feature,
  V2Cancellation,
  V2Tag
];
