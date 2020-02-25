import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  IsAlpha,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
  BeforeCreate,
  HasMany,
  BelongsTo,
  ForeignKey,
  BelongsToMany
} from "sequelize-typescript";

import uuidV4 from "uuid/v4";

import { Category, Listing, ListingTopic } from "./";

@Table({
  tableName: "topic"
})
export class Topic extends Model<Topic> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @Unique
  @IsAlpha
  @Column
  name!: string;

  @Column
  slug!: string;

  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column({ field: "category_id" })
  categoryId?: string;

  @Default(0)
  @Column
  order!: number;

  @Default(true)
  @Column({ field: "is_active" })
  isActive!: boolean;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;

  @BelongsTo(() => Category, "categoryId")
  // @BelongsToMany(() => ListingTopic, "topicId")
  // listings!: Listing[];
  @BeforeCreate
  static async generateId(instance: Topic) {
    instance.id = uuidV4();
  }

  @BeforeCreate
  static async generateSlug(instance: Topic) {
    const a = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;";
    const b = "aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------";
    const p = new RegExp(a.split("").join("|"), "g");
    instance.slug = instance.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(p, c => b.charAt(a.indexOf(c)))
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
}
