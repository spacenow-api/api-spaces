const {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  IsUUID
} = require("sequelize-typescript");

const { V2Listing, V2Rule } = require("./");

//@Table({
//  tableName: "ListingRules"
//})
export class V2ListingRules extends Model {
  listingId!;

  // @IsUUID(4)
  listSettingsId!;

  createdAt!;

  updatedAt!;
}
