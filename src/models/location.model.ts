import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  HasMany
} from "sequelize-typescript";
import { Listing } from "./";

@Table({
  tableName: "Location"
})
export class Location extends Model<Location> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  userId!: string;

  @Column
  country?: string;

  @Column
  address1?: string;

  @Column
  address2?: string;

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

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;

  @HasMany(() => Listing)
  listing!: Listing[];
}
