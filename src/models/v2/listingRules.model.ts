import { Table, Column, Model, CreatedAt, UpdatedAt, AllowNull, ForeignKey, IsUUID } from "sequelize-typescript";

import { V2Listing, V2Rule } from "./";

@Table({
  tableName: "listing_rule",
})
export class V2ListingRules extends Model<V2ListingRules> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  @ForeignKey(() => V2Rule)
  @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "rule_id" })
  ruleId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
