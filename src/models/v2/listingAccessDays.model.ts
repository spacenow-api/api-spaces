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
  AfterCreate,
  HasMany,
  ForeignKey,
  AfterUpdate,
  BeforeUpdate
} from "sequelize-typescript";

import { format } from "date-fns";

import { V2ListingAccessHours, V2Listing } from "./";

@Table({
  tableName: "ListingAccessDays"
})
export class V2ListingAccessDays extends Model<V2ListingAccessDays> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column
  listingId!: number;

  @Default(1)
  @AllowNull(false)
  @Column
  mon!: number;

  @Default(1)
  @AllowNull(false)
  @Column
  tue!: number;

  @Default(1)
  @AllowNull(false)
  @Column
  wed!: number;

  @Default(1)
  @AllowNull(false)
  @Column
  thu!: number;

  @Default(1)
  @AllowNull(false)
  @Column
  fri!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  sat!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  sun!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  all247!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;

  @HasMany(() => V2ListingAccessHours, "listingAccessDaysId")
  accessHours!: V2ListingAccessHours[];

  @AfterCreate
  static createAccessHours(instance: V2ListingAccessDays) {
    const openHour = new Date(`${format(new Date(), "YYYY-MM-DD")}T09:00`);
    const closeHour = new Date(`${format(new Date(), "YYYY-MM-DD")}T17:00`);
    for (let index = 0; index <= 6; index++) {
      V2ListingAccessHours.create({
        listingAccessDaysId: instance.id,
        weekday: index,
        openHour: openHour,
        closeHour: closeHour,
        allday: false
      });
    }
  }
}
