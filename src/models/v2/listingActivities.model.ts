import { Table, Column, Model, CreatedAt, UpdatedAt, AllowNull, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: "ListingActivities"
})
export class V2ListingActivities extends Model<V2ListingActivities> {
  @PrimaryKey
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
}
