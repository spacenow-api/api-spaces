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
  tableName: 'ListingAccessHours'
})
export class ListingAccessHours extends Model<ListingAccessHours> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

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

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
