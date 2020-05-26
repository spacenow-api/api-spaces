const {
  Table,
  Column,
  Model,
  AutoIncrement,
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
} = require("sequelize-typescript");

const uuidV4 = require("uuid/v4");

//@Table({
//  tableName: "Cancellation"
//})
export class V2Cancellation extends Model {
  id!;

  policyName!;

  policyContent!;

  isActive!;

  createdAt!;

  updatedAt!;
}
