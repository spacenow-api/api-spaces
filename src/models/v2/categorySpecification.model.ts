import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull
} from "sequelize-typescript";

@Table({
  tableName: "SubcategorySpecifications"
})
export class V2CategorySpecification extends Model<V2CategorySpecification> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column({ field: "category_id" })
  categoryId!: string;

  @AllowNull(false)
  @Column({ field: "specification_id" })
  specificationId!: string;

  @AllowNull(false)
  @Column({ field: "listSettingsParentId" })
  listSettingsParentId!: string;

  @AllowNull(false)
  @Column({ field: "listSettingsSpecificationId" })
  listSettingsSpecificationId!: string;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
