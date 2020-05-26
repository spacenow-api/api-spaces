const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  HasMany
} = require("sequelize-typescript");
const { V2Listing } = require("./");

//@Table({
//  tableName: "Location"
//})
export class V2Location extends Model {
  id!;

  userId!;

  country;

  address1;

  address2;

  buildingName;

  city;

  state;

  zipcode;

  lat;

  lng;

  placeId;

  createdAt;

  updatedAt;

  listings!;
}
