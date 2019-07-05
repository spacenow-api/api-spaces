interface IDraftRequest {
  locationId: number;
  listSettingsParentId: number;
  bookingPeriod?: string;
  title?: string;
  coverPhotoId?: number;
  quantity?: number;
  userId: string;
}

interface IAccessHoursRequest {
  weekday?: number;
  allday?: Boolean;
  openHour?: string;
  closeHour?: string;
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
  listingAccessHours?: Array<IAccessHoursRequest>;
}

interface IUpdateRequest {
  listingId: number;
  title?: string;
  accessType?: string;
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
}

export { IDraftRequest, IUpdateRequest };
