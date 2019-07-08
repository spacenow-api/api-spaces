import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  DataType
} from 'sequelize-typescript';

@Table({
  tableName: 'ListingAmenities'
})
export class ListingAmenities extends Model<ListingAmenities> {
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
  listSettingsId!: number;

  @Column
  amount?: number;

  @Column
  quantity?: number;

  @Column
  currency?: string;

  @Column
  settings?: string;

  @Column(DataType.ENUM('fixed', 'percentage'))
  type?: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
