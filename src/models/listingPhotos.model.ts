import { Table, Column, AutoIncrement, Model, CreatedAt, UpdatedAt, PrimaryKey, AllowNull, Default, BelongsTo, ForeignKey, DataType } from "sequelize-typescript";

import { Listing } from "./";

@Table({
  tableName: "ListingPhotos"
})
export class ListingPhotos extends Model<ListingPhotos> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => Listing)
  @AllowNull(false)
  @Column
  listingId!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @Default(0)
  @Column
  isCover?: number;

  @AllowNull(false)
  @Column
  bucket!: string;

  @AllowNull(false)
  @Column
  region!: string;

  @AllowNull(false)
  @Column
  key!: string;

  @AllowNull(false)
  @Column
  type!: string;

  @AllowNull(false)
  @Default("photo")
  @Column(DataType.ENUM("photo", "video", "floorplan", "menu"))
  category?: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;

  @BelongsTo(() => Listing)
  listing!: Listing;
}
