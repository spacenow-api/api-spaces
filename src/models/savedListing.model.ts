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
  HasMany,
  BelongsTo
} from 'sequelize-typescript'

import { UserLegacy, Listing } from '.'

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

  @BelongsTo(() => Listing, 'listingId')
  listing!: Listing

  @BelongsTo(() => UserLegacy, 'userId')
  user!: UserLegacy
}
