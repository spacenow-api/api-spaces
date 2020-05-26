const {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  HasOne
} = require("sequelize-typescript");

const { ListSettings, Listing } = require("../../models");

//@Table({
//  tableName: "ListingActivities"
//})
export class V2ListingActivities extends Model {
  listingId!;

  listSettingsId!;

  createdAt!;

  updatedAt!;

  settingsData!;
}
