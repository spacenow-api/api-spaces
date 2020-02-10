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
  BeforeUpdate
} from "sequelize-typescript";

import CryptoJS from "crypto-js";
import { jwtSecret } from "../../config"

import { V2Listing } from "./";

@Table({
  tableName: "ListingData"
})
export class V2ListingData extends Model<V2ListingData> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => V2Listing)
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

  @Default(1)
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

  @Column
  link?: string;

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

  @Column(
    DataType.ENUM(
      "Established space or business",
      "Private property",
      "Shared or sublet"
    )
  )
  listingType?: string;
  
  @Column
  direction?: string;
  
  @Column
  alcoholLicence?: string;

  @Column
  wifiNetwork?: string;

  @Column
  wifiUsername?: string;

  @Column
  wifiPassword?: string;

  @Column(DataType.VIRTUAL(DataType.STRING, ["wifiPasswordDecrypt"]))
  get wifiPasswordDecrypt(this: V2ListingData) {
    if (this.wifiPassword)
      return CryptoJS.AES.decrypt(this.wifiPassword, jwtSecret).toString()
  }

  @BelongsTo(() => V2Listing)
  listingData!: V2Listing;
  
  @BeforeUpdate
  static async hashWiFiPassword(instance: V2ListingData) {
    if (instance.wifiPassword)
      return instance.wifiPassword = CryptoJS.AES.encrypt(instance.wifiPassword, jwtSecret).toString()
  }

}
