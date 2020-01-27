import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  DataType,
  ForeignKey
} from "sequelize-typescript";

import { V2Listing } from "./";

@Table({
  tableName: "ListingAmenities"
})
export class V2ListingAmenities extends Model<V2ListingAmenities> {
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
  listSettingsId!: number;

  @Column
  amount?: number;

  @Column
  quantity?: number;

  @Column
  currency?: string;

  @Column
  settings?: string;

  @Column(DataType.ENUM("fixed", "percentage"))
  type?: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
