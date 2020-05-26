const {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  PrimaryKey,
  Unique,
  Default,
  BeforeCreate,
  ForeignKey,
  BelongsTo
} = require("sequelize-typescript");
const uuidV4 = require("uuid/v4");
const { User } = require("./user.model");

// @Table
export class Role extends Model {
  id!;

  name!;

  isActive!;

  createdAt!;

  updatedAt!;

  userId!;

  user!;

  static async generateId(instance) {
    instance.id = uuidV4();
  }
}
