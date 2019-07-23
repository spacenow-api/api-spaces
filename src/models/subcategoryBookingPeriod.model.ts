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
  tableName: 'SubcategoryBookingPeriod'
})
export class SubcategoryBookingPeriod extends Model<SubcategoryBookingPeriod> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  listSettingsParentId!: number;

  @Default(0)
  @Column
  monthly?: number;

  @Default(0)
  @Column
  weekly?: number;

  @Default(0)
  @Column
  daily?: number;

  @Default(0)
  @Column
  hourly?: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
