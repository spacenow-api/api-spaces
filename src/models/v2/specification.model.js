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
  DataType,
  HasMany
} = require("sequelize-typescript");

//@Table({
//  tableName: "ListSettings"
//})
export class V2Specification extends Model {
  id!;

  typeId!;

  itemName;

  otherItemName;

  description;

  maximum;

  minimum;

  startValue;

  endValue;

  step;

  isEnable;

  photo;

  photoType;

  isSpecification!;

  createdAt!;

  updatedAt!;

  specData;
}
