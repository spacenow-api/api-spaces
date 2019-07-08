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
  tableName: 'ListingPhotos'
})
export class ListingPhotos extends Model<ListingPhotos> {
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
  name!: string;

  @Default(0)
  @Column
  isCover?: number;

  @AllowNull(false)
  @Column
  bucket!: string;

  @AllowNull(false)
  @Column
  region!: string;

  @AllowNull(false)
  @Column
  key!: string;

  @AllowNull(false)
  @Column
  type!: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
