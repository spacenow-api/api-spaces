interface IDraftRequest {
  locationId: number;
  listSettingsParentId: number;
  bookingPeriod?: string;
  title?: string;
  coverPhotoId?: number;
  quantity?: number;
  listingActivities?: Array<number>;
}

interface IAccessHoursRequest {
  weekday: number;
  allday: Boolean;
  openHour: string;
  closeHour: string;
}

interface IAccessDaysRequest {
  listingId: number;
  mon?: Boolean;
  tue?: Boolean;
  wed?: Boolean;
  thu?: Boolean;
  fri?: Boolean;
  sat?: Boolean;
  sun?: Boolean;
  all247?: Boolean;
  listingAccessHours: Array<IAccessHoursRequest>;
}

interface IUpdateRequest {
  listingId: number;
  title?: string;
  bookingPeriod?: string;
  accessType?: string;
  listingStyle?: string;
  bookingNoticeTime?: string;
  minTerm?: number;
  maxTerm?: number;
  description?: string;
  basePrice?: number;
  currency?: string;
  isAbsorvedFee?: Boolean;
  capacity?: number;
  size?: number;
  meetingRooms?: number;
  isFurnished?: Boolean;
  carSpace?: number;
  sizeOfVehicle?: string;
  maxEntranceHeight?: string;
  spaceType?: string;
  bookingType?: string;
  listingAmenities?: Array<number>;
  listingAccessDays?: IAccessDaysRequest;
  listingExceptionDates?: Array<string>;
  listingRules?: Array<number>;
  listingActivities?: Array<number>;
  listingFeatures?: Array<number>;
  listingAccess?: Array<number>;
  listingStyles?: Array<number>;
  link?: string;
}

interface IReviews {
  id: number;
  reservationId: number;
  listId: number;
  authorId: string;
  userId: string;
  reviewContent?: string;
  rating: number;
  privateFeedback?: string;
  parentId?: number;
  automated?: number;
  createdAt: Date;
  updatedAt: Date;
  isAdmin?: number;
}

export { IDraftRequest, IUpdateRequest, IAccessDaysRequest, IReviews };
