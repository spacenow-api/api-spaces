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

const { V2ListingAccessDays } = require("./");

//@Table({
//  tableName: "ListingAccessHours"
//})
export class V2ListingAccessHours extends Model {
  id!;

  listingAccessDaysId!;

  weekday!;

  openHour;

  closeHour;

  allday!;

  peaktime!;

  createdAt!;

  updatedAt!;
}
