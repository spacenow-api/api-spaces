import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  DataType
} from 'sequelize-typescript';

@Table({
  tableName: 'Listing'
})
export class Listing extends Model<Listing> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @Column
  locationId?: number;

  @AllowNull(false)
  @Column
  userId!: string;

  @Column
  listSettingsParentId!: number;

  @AllowNull(false)
  @Column
  bookingPeriod!: string;

  @AllowNull(false)
  @Column
  roomType!: string;

  @AllowNull(false)
  @Column
  houseType!: string;

  @AllowNull(false)
  @Column
  residenceType!: string;

  @AllowNull(false)
  @Column
  bedrooms!: string;

  @AllowNull(false)
  @Column
  buildingSize!: string;

  @AllowNull(false)
  @Column
  bedType!: string;

  @AllowNull(false)
  @Column
  beds!: number;

  @AllowNull(false)
  @Column
  personCapacity!: number;

  @AllowNull(false)
  @Column
  bathrooms!: number;

  @AllowNull(false)
  @Column
  bathroomType!: string;

  @AllowNull(false)
  @Column
  country!: string;

  @AllowNull(false)
  @Column
  street!: string;

  @AllowNull(false)
  @Column
  buildingName!: string;

  @AllowNull(false)
  @Column
  city!: string;

  @AllowNull(false)
  @Column
  state!: string;

  @AllowNull(false)
  @Column
  zipcode!: string;

  @AllowNull(false)
  @Column
  lat!: string;

  @AllowNull(false)
  @Column
  lng!: string;

  @Default(false)
  @Column
  isMapTouched?: boolean;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  description!: string;

  @AllowNull(false)
  @Column
  coverPhoto!: number;

  @AllowNull(false)
  @Default('instant')
  @Column(DataType.ENUM('instant', 'request'))
  bookingType!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isPublished!: boolean;

  @AllowNull(false)
  @Default(false)
  @Column
  isReady!: boolean;

  @AllowNull(false)
  @Column
  coverPhotoId!: number;

  @AllowNull(false)
  @Column
  quantity!: number;

  @Default('active')
  @Column(DataType.ENUM('active', 'deleted'))
  status?: string;
}
