const {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  HasOne,
  PrimaryKey
} = require("sequelize-typescript");

const { V2Listing, V2Feature } = require("./");
const { ListSettings } = require("../");

//@Table({
//  tableName: "ListingFeatures"
//})
export class V2ListingFeatures extends Model {
  listSettingsId!;

  listingId!;

  createdAt!;

  updatedAt!;

  settingsData!;
}
