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
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  HasOne
} from "sequelize-typescript";

import { Listing, ListSettings, SubcategoryBookingPeriod } from "./";

@Table({
  tableName: "ListSettingsParent"
})
export class ListSettingsParent extends Model<ListSettingsParent> {
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => ListSettings)
  @Default("0")
  @AllowNull(false)
  @Column
  listSettingsParentId!: number;

  @ForeignKey(() => ListSettings)
  @AllowNull(false)
  @Column
  listSettingsChildId!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;

  @HasMany(() => Listing)
  listing!: Listing[];

  @BelongsTo(() => ListSettings, "listSettingsParentId")
  category!: ListSettings;

  @BelongsTo(() => ListSettings, "listSettingsChildId")
  subCategory!: ListSettings;

  @HasOne(() => SubcategoryBookingPeriod, "listSettingsParentId")
  bookingPeriod!: SubcategoryBookingPeriod;
}
