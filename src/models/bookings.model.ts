import {
  PrimaryKey,
  Table,
  Column,
  Model,
  AllowNull,
  Default,
  DataType,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";

@Table({
  tableName: 'Bookings'
})
export class Bookings extends Model<Bookings> {

  @PrimaryKey
  @AllowNull(false)
  @Column
  bookingId!: string;

  @AllowNull(false)
  @Column
  listingId!: number;

  @AllowNull(false)
  @Column
  hostId!: string;

  @AllowNull(false)
  @Column
  guestId!: string;

  @AllowNull(false)
  @Column
  confirmationCode!: number;

  @AllowNull(true)
  @Column
  sourceId?: string;

  @AllowNull(true)
  @Column
  chargeId?: string;

  @AllowNull(false)
  @Column
  priceType!: string;

  @Default(1)
  @AllowNull(true)
  @Column
  quantity?: number;

  @AllowNull(false)
  @Column
  currency!: string;

  @AllowNull(false)
  @Column
  period!: number;

  @AllowNull(false)
  @Column
  basePrice!: number;

  @AllowNull(false)
  @Column
  hostServiceFee!: number;

  @AllowNull(false)
  @Column
  guestServiceFee!: number;

  @AllowNull(false)
  @Column
  totalPrice!: number;

  @Default('instant')
  @AllowNull(true)
  @Column(DataType.ENUM("instant", "request"))
  bookingType?: string;

  @Default('pending')
  @AllowNull(true)
  @Column(DataType.ENUM(
    'pending',
    'requested',
    'approved',
    'declined',
    'completed',
    'cancelled',
    'expired',
    'recurring',
    'timeout'
  ))
  bookingState?: string;

  @Default('pending')
  @AllowNull(true)
  @Column(DataType.ENUM("pending", "completed"))
  paymentState?: string;

  @AllowNull(true)
  @Column
  checkIn?: string;

  @AllowNull(true)
  @Column
  checkOut?: string;

  @AllowNull(false)
  @Column
  reservations!: string;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @AllowNull(true)
  @Column
  checkInHour?: string;

  @AllowNull(true)
  @Column
  checkOutHour?: string;
}
