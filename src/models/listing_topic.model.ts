import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  ForeignKey
} from "sequelize-typescript";

import { Topic, Listing } from ".";

@Table({
  tableName: "listing_topic"
})
export class ListingTopic extends Model<ListingTopic> {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Topic)
  @Column({ field: "topic_id" })
  topicId?: string;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Listing)
  @Column({ field: "listing_id" })
  listingId?: number;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
