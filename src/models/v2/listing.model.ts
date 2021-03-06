import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
  HasMany,
  BelongsToMany,
  AfterCreate,
  AfterUpdate,
} from "sequelize-typescript";

import { UserProfile } from "../";
import {
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
  V2Feature,
} from "./";

import axios from "axios";
import { emailsApi } from "../../config";

@Table({
  tableName: "Listing",
})
export class V2Listing extends Model<V2Listing> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => UserProfile)
  @AllowNull(false)
  @Column
  userId!: string;

  @ForeignKey(() => V2Location)
  @Column
  locationId?: number;

  @Column
  listSettingsParentId?: string;

  @Column
  bookingPeriod?: string;

  @Column
  title?: string;

  @AllowNull(false)
  @Default("enquire")
  @Column(DataType.ENUM("request", "instant", "poa", "enquire"))
  bookingType?: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isPublished?: boolean;

  @AllowNull(false)
  @Default(false)
  @Column
  isReady?: boolean;

  @Default("active")
  @Column(DataType.ENUM("active", "deleted", "claimed"))
  status?: string;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BelongsTo(() => UserProfile)
  host!: UserProfile;

  @BelongsTo(() => V2Location, "locationId")
  location!: V2Location;

  @HasOne(() => V2ListingData, "listingId")
  listingData!: V2ListingData;

  @HasOne(() => V2ListingAccessDays, "listingId")
  accessDays!: V2ListingAccessDays;

  @HasMany(() => V2ListingPhotos, "listingId")
  photos!: V2ListingPhotos[];

  @BelongsToMany(() => V2Rule, () => V2ListingRules, "listingId")
  rules!: V2Rule[];

  @BelongsToMany(() => V2Amenity, () => V2ListingAmenities, "listingId")
  amenities!: V2Amenity[];

  @BelongsToMany(() => V2Feature, () => V2ListingFeatures, "listingId")
  features!: V2Feature[];

  @HasMany(() => V2ListingExceptionDates, "listingId")
  exceptionDates!: V2ListingExceptionDates[];

  @BelongsToMany(() => V2Tag, () => V2ListingTag, "listingId")
  tags!: V2Tag[];

  @AfterCreate
  static createListingSteps = (instance: V2Listing) => {
    return V2ListingSteps.create({ listingId: instance.id });
  };

  @AfterCreate
  static createListingAvailability = (instance: V2Listing) => {
    return V2ListingAccessDays.create({ listingId: instance.id });
  };

  @AfterCreate
  static createListingData = (instance: V2Listing) => {
    return V2ListingData.create({ listingId: instance.id });
  };

  @AfterUpdate
  static sendPublishEmail = (instance: V2Listing) => {
    if (
      instance.previous("isPublished") === false &&
      instance.isPublished === true
    )
      return axios.post(`${emailsApi}/email/listing/${instance.id}/publish`);
  };
}
