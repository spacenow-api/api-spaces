import {
  PrimaryKey,
  Table,
  Column,
  Model,
  AllowNull,
  Default,
  ForeignKey,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";

import { Listing } from './';

@Table({
  tableName: 'AddonsListing'
})
export class AddonsListing extends Model<AddonsListing> {

  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => Listing)
  @Column({ field: "id" })
  listingId!: number;

  @AllowNull(false)
  @Column
  description!: string;

  @AllowNull(false)
  @Column
  key!: string;

  @AllowNull(false)
  @Default(0)
  @Column
  value!: number;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

}
