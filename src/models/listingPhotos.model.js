const { Table, Column, AutoIncrement, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull, Default, BelongsTo, ForeignKey, DataType } = require("sequelize-typescript");

const { Listing } = require("./");

//@Table({
//  tableName: "ListingPhotos"
//})
export class ListingPhotos extends Model {
  id!;

  listingId!;

  name!;

  isCover;

  bucket!;

  region!;

  key!;

  type!;

  category;

  createdAt!;

  updatedAt!;

  listing!;
}
