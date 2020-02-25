import { Table, Column, AutoIncrement, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull, Default, DataType, BelongsTo, ForeignKey, BeforeUpdate } from "sequelize-typescript";

import CryptoJS from "crypto-js";
import { jwtSecret } from "../../config";

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

  @Default("Flexible")
  @AllowNull(false)
  @Column
  checkOut?: string;

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
  peakPrice?: number;

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
  @Column(DataType.ENUM("unavailable", "3months", "6months", "9months", "12months", "available"))
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

  @Column(DataType.ENUM("Established space or business", "Private property", "Shared or sublet"))
  listingType?: string;

  @Column
  direction?: string;

  @Column
  listingStyle?: string;

  @Column
  alcoholLicence?: string;

  @Column
  wifiSpeed?: string;

  @Column
  wifiNetwork?: string;

  @Column
  get wifiPassword(): string {
    if (this.getDataValue("wifiPassword") !== null) {
      const keyHex = CryptoJS.enc.Utf8.parse(jwtSecret);
      const ciphertext = CryptoJS.enc.Base64.parse(this.getDataValue("wifiPassword"));
      // @ts-ignore
      const decrypted = CryptoJS.DES.decrypt({ ciphertext }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return "";
  }
  set wifiPassword(value: string) {
    const keyHex = CryptoJS.enc.Utf8.parse(jwtSecret);
    const encrypted = CryptoJS.DES.encrypt(value, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.setDataValue("wifiPassword", encrypted.toString());
  }

  @Column
  capacityCocktail?: number;

  @Column
  capacityBanquet?: number;

  @Column
  capacityTheatre?: number;

  @Column
  capacityClassroom?: number;

  @Column
  capacityBoardroom?: number;

  @BelongsTo(() => V2Listing)
  listingData!: V2Listing;
}
