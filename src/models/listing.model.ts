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

  @AllowNull(false)
  @Column
  listSettingsParentId!: number;

  @Column
  bookingPeriod?: string;

  @Column
  roomType?: string;

  @Column
  houseType?: string;

  @Column
  residenceType?: string;

  @Column
  bedrooms?: string;

  @Column
  buildingSize?: string;

  @Column
  bedType?: string;

  @Column
  beds?: number;

  @Column
  personCapacity?: number;

  @Column
  bathrooms?: number;

  @Column
  bathroomType?: string;

  @Column
  country?: string;

  @Column
  street?: string;

  @Column
  buildingName?: string;

  @Column
  city?: string;

  @Column
  state?: string;

  @Column
  zipcode?: string;

  @Column
  lat?: string;

  @Column
  lng?: string;

  @Default(false)
  @Column
  isMapTouched?: boolean;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Column
  title?: string;

  @Column
  description?: string;

  @Column
  coverPhoto?: number;

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

  @Column
  coverPhotoId?: number;

  @Column
  quantity?: number;

  @Default('active')
  @Column(DataType.ENUM('active', 'deleted'))
  status?: string;
}
