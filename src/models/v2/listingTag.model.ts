import { Table, Column, Model, AllowNull, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

import { V2Listing, V2Tag } from "./";

@Table({
  tableName: "listing_tag"
})
export class V2ListingTag extends Model<V2ListingTag> {
  @ForeignKey(() => V2Listing)
  @AllowNull(false)
  @Column({ field: "listing_id" })
  listingId!: number;

  @ForeignKey(() => V2Tag)
  @AllowNull(false)
  @Column({ field: "tag_id" })
  tagId!: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
