import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  HasOne
} from "sequelize-typescript";

import { ListSettings, Listing } from "../../models";

@Table({
  tableName: "ListingActivities"
})
export class V2ListingActivities extends Model<V2ListingActivities> {
  @ForeignKey(() => Listing)
  @AllowNull(false)
  @Column({ field: "listingId" })
  listingId!: number;

  @PrimaryKey
  @AllowNull(false)
  @Column({ field: "listSettingsId" })
  listSettingsId!: number;

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
