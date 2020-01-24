import {
  PrimaryKey,
  Table,
  Column,
  Model,
  AllowNull,
  ForeignKey,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";

import { Bookings, AddonsListing } from './';

@Table({
  tableName: 'AddonsBooking'
})
export class AddonsBooking extends Model<AddonsBooking> {

  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => Bookings)
  @Column({ field: "bookingId" })
  bookingId!: string;

  @AllowNull(false)
  @ForeignKey(() => AddonsListing)
  @Column({ field: "id" })
  addonId!: string;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

}
