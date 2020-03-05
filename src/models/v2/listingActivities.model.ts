import { Table, Column, Model, CreatedAt, UpdatedAt, AllowNull, PrimaryKey } from "sequelize-typescript";

import { V2Listing } from "./";
import { ListSettings } from "../";

@Table({
  tableName: "listing_activity"
})
export class V2ListingActivity extends Model<V2ListingActivity> {
  // @ForeignKey(() => V2Listing)
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  // @ForeignKey(() => ListSettings)
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: "activity_id" })
  activityId!: number;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
