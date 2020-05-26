const {
  V2ListingPhotos,
  V2ListingAccessDays,
  V2ListingData,
  V2ListingSteps,
  V2ListingAmenities,
  V2ListingRules,
  V2ListingExceptionDates,
  V2Tag,
  V2ListingTag,
  V2Location,
  V2Rule,
  V2Amenity,
  V2ListingFeatures,
  V2Feature
} = require("./");

const axios = require("axios");
const { emailsApi } = require("../../config");

//@Table({
//  tableName: "Listing"
//})
export class V2Listing extends Model {
  id!;

  userId!;

  locationId;

  listSettingsParentId;

  bookingPeriod;

  title;

     bookingType;

  isPublished;

  isReady;

    status;

  createdAt!;

  updatedAt!;

   host!;

   location!;

   listingData!;

   accessDays!;

   photos!;

  rules!;

  amenities!;

  features!;

   exceptionDates!;

  tags!;

  static createListingSteps = (instance) => {
    return V2ListingSteps.create({ listingId: instance.id });
  };

  static createListingAvailability = (instance) => {
    return V2ListingAccessDays.create({ listingId: instance.id });
  };

  static createListingData = (instance) => {
    return V2ListingData.create({ listingId: instance.id });
  };

  static sendPublishEmail = (instance) => {
    if (instance.previous("isPublished") === false && instance.isPublished === true) return axios.post(`${emailsApi}/email/listing/${instance.id}/publish`);
  };
}
