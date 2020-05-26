
// @Table({
//   tableName: 'Bookings',
//   timestamps: false
// })
export class Bookings extends Model {

  bookingId!;

  listingId!;

  hostId!;

  guestId!;

  confirmationCode!;

  sourceId;

  chargeId;

  priceType!;

  quantity;

  currency!;

  period!;

  basePrice!;

  hostServiceFee!;

  guestServiceFee!;

  totalPrice!;

  bookingType;

  bookingState;

  paymentState;

  checkIn;

  checkOut;

  message;

  reservations!;

  createdAt!;

  updatedAt!;

  checkInHour;

  checkOutHour;

  voucherCode;

}
