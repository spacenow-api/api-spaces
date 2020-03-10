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

// import { V2Listing, V2Access } from "./";

@Table({
  tableName: "ListingAccess"
})
export class V2ListingAccess extends Model<V2ListingAccess> {
  // @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listingId" })
  listingId!: number;

  // @ForeignKey(() => V2Access)
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
