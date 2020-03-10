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
  tableName: "listingStyles"
})
export class V2ListingStyles extends Model<V2ListingStyles> {
  // @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listingId" })
  listingId!: number;

  // @ForeignKey(() => V2Access)
  // @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "listSettingsId" })
  accessId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "createdAt" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updatedAt" })
  updatedAt!: Date;
}
