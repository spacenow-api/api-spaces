const { Listing } = require("./listing.model");
const { ListingData } = require("./listingData.model");
const { ListSettings } = require("./listSettings.model");
const { ListSettingsParent } = require("./listSettingsParent.model");
const { Location } = require("./location.model");
const { UniqueLocation } = require("./uniqueLocation.model");
const { ListingAccessDays } = require("./listingAccessDays.model");
const { ListingAccessHours } = require("./listingAccessHours.model");
const { ListingAmenities } = require("./listingAmenities.model");
const { ListingExceptionDates } = require("./listingExceptionDates.model");
const { ListingRules } = require("./listingRules.model");
const { ListingPhotos } = require("./listingPhotos.model");
const { SubcategorySpecifications } = require("./subcategorySpecifications.model");
const { SubcategoryBookingPeriod } = require("./subcategoryBookingPeriod.model");
const { UserProfile } = require("./userProfile.model");
const { Reviews } = require("./reviews.model");
const { Bookings } = require("./bookings.model");
const { ExternalClicks } = require("./externalClicks.model");
const { Inspection } = require("./inspection.model");
const { Category } = require("./category.model");
const { CategorySpecification } = require("./category_specification.model");
const { CategoryBookingPeriod } = require("./category_booking_period.model");
const { Topic } = require("./topic.model");
const { ListingTopic } = require("./listing_topic.model");
const { User } = require("./user.model");
const { Role } = require("./role.model");
const { AddonsBooking } = require("./addonsBooking.model");
const { AddonsListing } = require("./addonsListing.model");
const { AddonsSubCategorySuggestions } = require("./addonsSubCategorySuggestions.model");
const { MessageItem } = require("./messageItem.model");
const { Message } = require("./message.model");
const { SavedListing } = require("./savedListing.model");

const {
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
  V2ListingAccess,
  V2ListingRules,
  V2ListingFeatures,
  V2ListingExceptionDates,
  V2ListingActivities,
  V2ListingStyles,
  V2Location,
  V2UniqueLocation,
  V2Rule,
  V2Amenity,
  V2Feature,
  V2Cancellation,
  V2Tag
} = require("./v2");

export {
  Listing,
  ListingData,
  ListSettings,
  ListSettingsParent,
  Location,
  UniqueLocation,
  ListingAccessDays,
  ListingAccessHours,
  ListingAmenities,
  ListingExceptionDates,
  V2ListingActivities,
  V2ListingStyles,
  ListingRules,
  ListingPhotos,
  SubcategorySpecifications,
  SubcategoryBookingPeriod,
  UserProfile,
  Reviews,
  Bookings,
  ExternalClicks,
  Inspection,
  Category,
  CategorySpecification,
  CategoryBookingPeriod,
  Topic,
  ListingTopic,
  User,
  Role,
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
  V2ListingAccess,
  V2ListingRules,
  V2ListingExceptionDates,
  V2ListingFeatures,
  V2Location,
  V2UniqueLocation,
  V2Rule,
  V2Tag,
  V2Amenity,
  V2Feature,
  V2Cancellation,
  AddonsBooking,
  AddonsListing,
  AddonsSubCategorySuggestions,
  MessageItem,
  SavedListing,
  Message
};

export const arrayOfModels = [
  Listing,
  ListingData,
  ListSettings,
  ListSettingsParent,
  Location,
  UniqueLocation,
  ListingAccessDays,
  ListingAccessHours,
  ListingAmenities,
  ListingExceptionDates,
  ListingRules,
  ListingPhotos,
  SubcategorySpecifications,
  SubcategoryBookingPeriod,
  UserProfile,
  Reviews,
  Bookings,
  ExternalClicks,
  Inspection,
  Category,
  CategorySpecification,
  CategoryBookingPeriod,
  Topic,
  ListingTopic,
  User,
  Role,
  V2Category,
  V2ListingTag,
  V2CategorySpecification,
  V2Listing,
  V2ListingStyles,
  V2ListingAccessDays,
  V2ListingAccessHours,
  V2ListingData,
  V2ListingPhotos,
  V2ListingSteps,
  V2ListingAmenities,
  V2ListingAccess,
  V2ListingRules,
  V2ListingExceptionDates,
  V2ListingActivities,
  V2ListingFeatures,
  V2Location,
  V2UniqueLocation,
  V2Rule,
  V2Tag,
  V2Amenity,
  V2Feature,
  V2Cancellation,
  AddonsBooking,
  AddonsListing,
  AddonsSubCategorySuggestions,
  MessageItem,
  SavedListing,
  Message
];
