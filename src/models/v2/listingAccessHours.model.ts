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

import { V2ListingAccessDays } from "./";

@Table({
  tableName: "ListingAccessHours"
})
export class V2ListingAccessHours extends Model<V2ListingAccessHours> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => V2ListingAccessDays)
  @AllowNull(false)
  @Column
  listingAccessDaysId!: number;

  @AllowNull(false)
  @Column
  weekday!: string;

  @Column
  openHour?: Date;

  @Column
  closeHour?: Date;

  @AllowNull(false)
  @Column
  allday!: number;

  @AllowNull(false)
  @Column
  peaktime!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
