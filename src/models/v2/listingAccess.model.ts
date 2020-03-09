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

import { V2Listing, V2Access } from "./";

@Table({
  tableName: "listing_access"
})
export class V2ListingAccess extends Model<V2ListingAccess> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  @ForeignKey(() => V2Access)
  @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "access_id" })
  accessId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
