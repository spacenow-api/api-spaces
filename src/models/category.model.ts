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
  ForeignKey
} from "sequelize-typescript";

import uuidV4 from "uuid/v4";

@Table({
  tableName: "category"
})
export class Category extends Model<Category> {
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
  @ForeignKey(() => Category)
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

  @HasMany(() => Category, "parentId")
  children: Category[] | undefined;

  @BeforeCreate
  static async generateId(instance: Category) {
    instance.id = uuidV4();
  }

  @BeforeCreate
  static async generateSlug(instance: Category) {
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
