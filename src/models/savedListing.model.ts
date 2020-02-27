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
  DataType,
  HasMany
} from 'sequelize-typescript'

import { User, Listing } from '.'

@Table({
  tableName: 'SavedListings'
})
export class SavedListing extends Model<SavedListing> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number

  @AllowNull(false)
  @Column
  userId!: string

  @AllowNull(false)
  @Column
  listingId!: number

  @HasMany(() => Listing, 'listingId')
  listing!: Listing

  @HasMany(() => User, 'userId')
  user!: User
}
