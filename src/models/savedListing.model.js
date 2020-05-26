const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  BelongsTo
} = require('sequelize-typescript');

const { UserProfile, Listing } = require('.');

//@Table({
//  tableName: 'SavedListings'
//})
export class SavedListing extends Model {
  id!

  userId!

  listingId!

  createdAt;

  updatedAt;

  listing!

  user!
}
