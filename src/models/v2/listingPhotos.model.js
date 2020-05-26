const { Table, Column, AutoIncrement, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull, Default, BelongsTo, ForeignKey, DataType } = require("sequelize-typescript");

const { V2Listing } = require("./");

//@Table({
//  tableName: "ListingPhotos"
//})
export class V2ListingPhotos extends Model {
  id!;

  listingId!;

  name!;

  category;

  isCover;

  type!;

  createdAt!;

  updatedAt!;

  listing!;
}
