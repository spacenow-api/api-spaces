const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default
} = require("sequelize-typescript");

//@Table({
//  tableName: "SubcategoryBookingPeriod"
//})
export class SubcategoryBookingPeriod extends Model {
  id!;

  listSettingsParentId!;

  monthly;

  weekly;

  daily;

  hourly;

  createdAt!;

  updatedAt!;
}
