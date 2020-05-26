//@Table({
//  tableName: 'ListingData'
//})
export class ListingData extends Model {
  id!;

  listingId;

  listId;

  bookingNoticeTime;

  checkInStart;

  checkInEnd;

  minNight;

  maxNight;

  priceMode;

  basePrice;

  maxPrice;

  currency;

  hostingFrequency;

  weeklyDiscount;

  monthlyDiscount;

  createdAt;

  updatedAt;

  cleaningPrice;

  maxDaysNotice;

  cancellationPolicy;

  minTerm;

  maxTerm;

  description;

  isAbsorvedFee;

  capacity;

  size;

  meetingRooms;

  isFurnished;

  carSpace;

  ListingDatacol;

  link;

  sizeOfVehicle;

  maxEntranceHeight;

  spaceType;

  bookingType;

  accessType;

  listingStyle;

  listing!;
}
