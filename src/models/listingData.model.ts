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
  ForeignKey
} from "sequelize-typescript";

import { Listing } from "./";

@Table({
  tableName: "ListingData"
})
export class ListingData extends Model<ListingData> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => Listing)
  @Column
  listingId?: number;

  @Column
  listId?: number;

  @Column
  bookingNoticeTime?: string;

  @Default("Flexible")
  @AllowNull(false)
  @Column
  checkInStart?: string;

  @Default("Flexible")
  @AllowNull(false)
  @Column
  checkInEnd?: string;

  @Column
  minNight?: number;

  @Column
  maxNight?: number;

  @Column
  priceMode?: number;

  @Column
  basePrice?: number;

  @Column
  maxPrice?: number;

  @Column
  currency?: string;

  @Column
  hostingFrequency?: string;

  @Column
  weeklyDiscount?: string;

  @Column
  monthlyDiscount?: string;

  @Column
  createdAt?: Date;

  @Column
  updatedAt?: Date;

  @Column
  cleaningPrice?: number;

  @AllowNull(false)
  @Default("unavailable")
  @Column(
    DataType.ENUM(
      "unavailable",
      "3months",
      "6months",
      "9months",
      "12months",
      "available"
    )
  )
  maxDaysNotice?: string;

  @Default(1)
  @Column
  cancellationPolicy?: number;

  @Column
  minTerm?: number;

  @Column
  maxTerm?: number;

  @Column
  description?: string;

  @Default(0)
  @Column
  isAbsorvedFee?: number;

  @Column
  capacity?: number;

  @Default(0)
  @Column
  size?: number;

  @Column
  meetingRooms?: number;

  @Default(0)
  @Column
  isFurnished?: number;

  @Column
  carSpace?: number;

  @Column
  ListingDatacol?: string;

  @Column(DataType.ENUM("Small", "Medium", "Large"))
  sizeOfVehicle?: string;

  @Column
  maxEntranceHeight?: string;

  @Column(DataType.ENUM("Cover", "Undercover"))
  spaceType?: string;

  @Default("instant")
  @Column(DataType.ENUM("request", "instant"))
  bookingType?: string;

  @Column
  accessType?: string;

  @BelongsTo(() => Listing)
  listing!: Listing;
}
