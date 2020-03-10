import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  IsUUID
} from "sequelize-typescript";

import { V2Listing, V2Rule } from "./";

@Table({
  tableName: "ListingRules"
})
export class V2ListingRules extends Model<V2ListingRules> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listingId" })
  listingId!: number;

  @ForeignKey(() => V2Rule)
  // @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "listSettingsId" })
  listSettingsId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "createdAt" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updatedAt" })
  updatedAt!: Date;
}
