import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull
} from 'sequelize-typescript';

@Table({
  tableName: 'ListingRules'
})
export class ListingRules extends Model<ListingRules> {
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
  listSettingsId?: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
