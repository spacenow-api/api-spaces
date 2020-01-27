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
  tableName: "ListingExceptionDates"
})
export class V2ListingExceptionDates extends Model<V2ListingExceptionDates> {
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
  blockedDate?: Date;

  @Column
  calendarId?: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
