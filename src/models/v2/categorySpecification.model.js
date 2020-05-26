const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull
} = require("sequelize-typescript");

//@Table({
//  tableName: "SubcategorySpecifications"
//})
export class V2CategorySpecification extends Model {
  id!;

  categoryId!;

  specificationId!;

  listSettingsParentId!;

  listSettingsSpecificationId!;

  createdAt;

  updatedAt;
}
