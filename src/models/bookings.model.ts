import {
  PrimaryKey,
  Table,
  Column,
  Model,
  AllowNull,
  Default,
  DataType
} from "sequelize-typescript";

@Table({
  tableName: 'Bookings',
  timestamps: false
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

  @AllowNull(true)
  @Column
  message?: string;

  @AllowNull(false)
  @Column
  reservations!: string;

  @AllowNull(false)
  @Column
  createdAt!: number;

  @AllowNull(false)
  @Column
  updatedAt!: number;

  @AllowNull(true)
  @Column
  checkInHour?: string;

  @AllowNull(true)
  @Column
  checkOutHour?: string;

  @AllowNull(true)
  @Column
  voucherCode?: string

}
