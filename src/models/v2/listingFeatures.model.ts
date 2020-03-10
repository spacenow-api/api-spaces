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
  tableName: "ListingFeatures"
})
export class V2ListingFeatures extends Model<V2ListingFeatures> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listingId" })
  listingId!: number;

  @ForeignKey(() => V2Feature)
  // @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "listSettingsId" })
  listSettingsId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "createdAt" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updatedAt" })
  updatedAt!: Date;
}
