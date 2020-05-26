
const axios = require('axios');
const { emailsApi } = require('../config');

//@Table({
//  tableName: 'Listing'
//})
export class Listing extends Model {
  id!;

  locationId;

  userId!

  listSettingsParentId!

  bookingPeriod;

  roomType;

  houseType;

  residenceType;

  bedrooms;

  buildingSize;

  bedType;

  beds;

  personCapacity;

  bathrooms;

  bathroomType;

  country;

  street;

  buildingName;

  city;

  state;

  zipcode;

  lat;

  lng;

  isMapTouched;

  createdAt!

  updatedAt!

  title;

  description;

  coverPhoto;

  bookingType!

  isPublished!

  isReady!

  coverPhotoId;

  quantity;

  status;

  // @BelongsToMany(() => ListingTopic, "listingId")
  // topics!;

  location!

  listingData!

  host!

  listingPhotos!

  listingSettings!

  listing!

  static sendPublishEmail(instance) {
    if (instance.previous('isPublished') === false && instance.isPublished === true)
      axios.post(`${emailsApi}/email/listing/${instance.id}/publish`)
  }
}
