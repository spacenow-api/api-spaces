const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  DataType
} = require('sequelize-typescript');

//@Table({
//  tableName: 'SubcategorySpecifications'
//})
export class SubcategorySpecifications extends Model {

  id!;

  listSettingsParentId!;

  listSettingsSpecificationId!;

  createdAt;

  updatedAt;
}
