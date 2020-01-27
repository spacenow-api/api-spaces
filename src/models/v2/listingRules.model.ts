import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  ForeignKey
} from "sequelize-typescript";

import { V2Listing } from "./";

@Table({
  tableName: "ListingRules"
})
export class V2ListingRules extends Model<V2ListingRules> {
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

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
