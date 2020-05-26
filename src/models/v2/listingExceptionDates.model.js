const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  ForeignKey
} = require("sequelize-typescript");

const { V2Listing } = require("./");

//@Table({
//  tableName: "ListingExceptionDates"
//})
export class V2ListingExceptionDates extends Model {
  id!;

  listingId!;

  blockedDate;

  calendarId;

  createdAt!;

  updatedAt!;
}
