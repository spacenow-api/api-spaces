import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  PrimaryKey,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate
} from "sequelize-typescript";

import uuidV4 from "uuid/v4";

import { Category } from ".";

@Table({
  tableName: "category_specification"
})
export class CategorySpecification extends Model<CategorySpecification> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column({ field: "category_id" })
  categoryId?: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;

  @BelongsTo(() => Category, "categoryId")
  @BeforeCreate
  static async generateId(instance: CategorySpecification) {
    instance.id = uuidV4();
  }
}
