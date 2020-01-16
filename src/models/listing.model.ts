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
  AfterBulkUpdate,
  AfterUpdate
} from "sequelize-typescript";

import {
  Location,
  ListingData,
  ListingPhotos,
  ListSettingsParent,
  UserProfile,
  ListingTopic,
  Topic
} from "./";

import axios from "axios";
import { emailsApi } from "../config";

@Table({
  tableName: "Listing"
})
export class Listing extends Model<Listing> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => Location)
  @Column
  locationId?: number;

  @ForeignKey(() => UserProfile)
  @AllowNull(false)
  @Column
  userId!: string;

  @ForeignKey(() => ListSettingsParent)
  @AllowNull(false)
  @Column
  listSettingsParentId!: number;

  @Column
  bookingPeriod?: string;

  @Column
  roomType?: string;

  @Column
  houseType?: string;

  @Column
  residenceType?: string;

  @Column
  bedrooms?: string;

  @Column
  buildingSize?: string;

  @Column
  bedType?: string;

  @Column
  beds?: number;

  @Column
  personCapacity?: number;

  @Column
  bathrooms?: number;

  @Column
  bathroomType?: string;

  @Column
  country?: string;

  @Column
  street?: string;

  @Column
  buildingName?: string;

  @Column
  city?: string;

  @Column
  state?: string;

  @Column
  zipcode?: string;

  @Column
  lat?: string;

  @Column
  lng?: string;

  @Default(false)
  @Column
  isMapTouched?: boolean;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Column
  title?: string;

  @Column
  description?: string;

  @Column
  coverPhoto?: number;

  @AllowNull(false)
  @Default("instant")
  @Column(DataType.ENUM("instant", "request", "poa"))
  bookingType!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isPublished!: boolean;

  @AllowNull(false)
  @Default(false)
  @Column
  isReady!: boolean;

  @Column
  coverPhotoId?: number;

  @Default(1)
  @Column
  quantity?: number;

  @Default("active")
  @Column(DataType.ENUM("active", "deleted", "claimed"))
  status?: string;

  // @BelongsToMany(() => ListingTopic, "listingId")
  // topics!: Topic[];

  @BelongsTo(() => Location)
  location!: Location;

  @HasOne(() => ListingData)
  listingData!: ListingData;

  @BelongsTo(() => UserProfile)
  host!: UserProfile;

  @HasMany(() => ListingPhotos)
  listingPhotos!: ListingPhotos;

  @BelongsTo(() => ListSettingsParent)
  listingSettings!: ListSettingsParent;

  @AfterUpdate
  static sendPublishEmail(instance: Listing) {
    if (
      instance.previous("isPublished") === false &&
      instance.isPublished === true
    )
      axios.post(`${emailsApi}/email/listing/${instance.id}/publish`);
  }
}
