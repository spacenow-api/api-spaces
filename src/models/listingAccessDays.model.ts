import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default
} from 'sequelize-typescript';

@Table({
  tableName: 'ListingAccessDays'
})
export class ListingAccessDays extends Model<ListingAccessDays> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  listingId!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  mon!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  tue!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  wed!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  thu!: number;

  @Default(0)
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
}
