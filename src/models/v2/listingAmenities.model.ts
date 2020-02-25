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

import { V2Listing, V2Amenity } from "./";

@Table({
  tableName: "listing_amenity"
})
export class V2ListingAmenities extends Model<V2ListingAmenities> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  @ForeignKey(() => V2Amenity)
  @IsUUID(4)
  @AllowNull(false)
  @Column({ field: "amenity_id" })
  amenityId!: string;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
