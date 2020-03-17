import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  HasOne,
  PrimaryKey
} from "sequelize-typescript";

import { V2Listing, V2Feature } from "./";
import { ListSettings } from "../";

@Table({
  tableName: "ListingFeatures"
})
export class V2ListingFeatures extends Model<V2ListingFeatures> {
  @ForeignKey(() => V2Feature)
  @AllowNull(false)
  @Column({ field: "listSettingsId" })
  listSettingsId!: string;

  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listingId" })
  listingId!: number;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "createdAt" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updatedAt" })
  updatedAt!: Date;

  @HasOne(() => ListSettings, "id")
  settingsData!: ListSettings;
}
