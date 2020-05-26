const {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  CreatedAt,
  UpdatedAt
} = require('sequelize-typescript');

//@Table({
//  tableName: 'UniqueLocation'
//})
export class UniqueLocation extends Model {
  id!;

  locationId!;

  createdAt!;

  updatedAt!;
}
