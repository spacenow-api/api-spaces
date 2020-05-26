const { Table, Column, AutoIncrement, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull, Default, DataType, BelongsTo, ForeignKey, BeforeUpdate } = require("sequelize-typescript");

const CryptoJS = require("crypto-js");
const { jwtSecret } = require("../../config");

const { V2Listing } = require("./");

//@Table({
//  tableName: "ListingData"
//})
export class V2ListingData extends Model {
  id!;

  listingId;

  listId;

  bookingNoticeTime;

  checkInStart;

  checkInEnd;

  checkOut;

  minNight;

  maxNight;

  priceMode;

  basePrice;

  maxPrice;

  peakPrice;

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

  listingType;

  direction;

  listingStyle;

  alcoholLicence;

  wifiSpeed;

  wifiNetwork;

  get wifiPassword() {
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
  set wifiPassword(value) {
    const keyHex = CryptoJS.enc.Utf8.parse(jwtSecret);
    const encrypted = CryptoJS.DES.encrypt(value, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.setDataValue("wifiPassword", encrypted.toString());
  }

  capacityCocktail;

  capacityBanquet;

  capacityTheatre;

  capacityClassroom;

  capacityBoardroom;

  listingData!;
}
