import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  IsUUID
} from "sequelize-typescript";

import { V2Listing, V2Feature } from "./";

@Table({
  tableName: "listing_feature"
})
export class V2ListingFeatures extends Model<V2ListingFeatures> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  @ForeignKey(() => V2Feature)
  @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "feature_id" })
  featureId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
