import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  PrimaryKey,
  Default,
  AllowNull,
  AutoIncrement,
  Unique,
  HasOne,
  HasMany
} from 'sequelize-typescript'

import { Listing, SavedListing } from '.'

@Table({
  tableName: 'UserProfile'
})
export class UserProfile extends Model<UserProfile> {
  @IsUUID(4)
  @PrimaryKey
  @AllowNull(false)
  @Column
  userId!: string

  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column
  profileId!: number

  @Column
  firstName?: string

  @Column
  lastName?: string

  @Column
  displayName?: string

  @Column
  dateOfBirth?: string

  @Default('')
  @Column
  picture?: string

  @Column
  gender?: string

  @Column
  phoneNumber?: string

  @Column
  preferredLanguage?: string

  @Column
  preferredCurrency?: string

  @Column
  info?: string

  @Column
  location?: string

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date

  @Column
  stripeCusId?: string

  @Default(1)
  @Column
  country?: number

  @Column
  verificationCode?: number

  @Column
  countryCode?: string

  @Column
  customerId?: string

  @Column
  accountId?: string

  @Column
  userLocationId?: number

  @Column
  profileType?: string

  @Column
  companyName?: string

  @Column
  companyId?: string

  @Column
  contactJobRole?: string

  @HasOne(() => Listing)
  host!: Listing

  @HasMany(() => SavedListing, 'userId')
  user!: SavedListing
}
