import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  BelongsTo,
  ForeignKey,
  DataType,
} from "sequelize-typescript";

import { V2Listing } from "./";

@Table({
  tableName: "ListingPhotos",
})
export class V2ListingPhotos extends Model<V2ListingPhotos> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column
  listingId!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @Column(DataType.ENUM("photo", "video", "floorplan"))
  category?: string;

  @Default(0)
  @Column
  isCover?: number;

  @Column
  type!: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;

  @BelongsTo(() => V2Listing)
  listing!: V2Listing;
}
