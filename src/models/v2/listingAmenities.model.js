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

const { V2Listing, V2Amenity } = require("./");

//@Table({
//  tableName: "listing_amenity"
//})
export class V2ListingAmenities extends Model {
  listingId!;

  amenityId!;

  createdAt!;

  updatedAt!;
}
