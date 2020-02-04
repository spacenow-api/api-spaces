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
  BelongsToMany,
  ForeignKey
} from "sequelize-typescript";

import { V2ListingCategory, V2Listing } from "./";

import uuidV4 from "uuid/v4";

@Table({
  tableName: "category"
})
export class V2Category extends Model<V2Category> {
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

  @AllowNull(true)
  @Default(null)
  @ForeignKey(() => V2Category)
  @Column({ field: "parent_id" })
  parentId?: string;

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

  @HasMany(() => V2Category, "parentId")
  children: V2Category[] | undefined;

  @BelongsToMany(
    () => V2Listing,
    () => V2ListingCategory,
    "listingId"
  )
  listings: V2Listing[] | undefined;

  @BeforeCreate
  static async generateId(instance: V2Category) {
    return (instance.id = uuidV4());
  }

  @BeforeCreate
  static async generateSlug(instance: V2Category) {
    const a = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;";
    const b = "aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------";
    const p = new RegExp(a.split("").join("|"), "g");
    return (instance.slug = instance.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(p, c => b.charAt(a.indexOf(c)))
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, ""));
  }
}
