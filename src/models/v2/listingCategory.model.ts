import {
  Table,
  Column,
  Model,
  AllowNull,
  ForeignKey,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";

import { V2Listing, V2Category } from "./";

@Table({
  tableName: "listing_category"
})
export class V2ListingCategory extends Model<V2ListingCategory> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  @ForeignKey(() => V2Category)
  @AllowNull(false)
  @Column({ field: "category_id" })
  categoryId!: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
