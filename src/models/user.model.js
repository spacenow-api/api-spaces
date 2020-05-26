const {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsEmail,
  IsUUID,
  PrimaryKey,
  Length,
  Unique,
  Default,
  BeforeCreate,
  HasMany
} = require('sequelize-typescript');
const bcryptjs = require('bcryptjs');
const uuidV4 = require('uuid/v4');
const { Role } = require('./role.model');

// @Table
export class User extends Model {
  id!

  email!

  password!

  isEmailConfirmed!

  isActive!

  createdAt!

  updatedAt!

  role!

  static async generateId(instance) {
    instance.id = uuidV4()
  }

  static async hashPassword(instance) {
    instance.password = bcryptjs.hashSync(instance.password, bcryptjs.genSaltSync(8))
  }
}
