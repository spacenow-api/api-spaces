const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull
} = require('sequelize-typescript');

//@Table({
//  tableName: 'ListingExceptionDates'
//})
export class ListingExceptionDates extends Model {
  id!;

  listingId!;

  blockedDate;

  calendarId;

  createdAt!;

  updatedAt!;
}
