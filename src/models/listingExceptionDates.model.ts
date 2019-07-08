import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull
} from 'sequelize-typescript';

@Table({
  tableName: 'ListingExceptionDates'
})
export class ListingExceptionDates extends Model<ListingExceptionDates> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

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
