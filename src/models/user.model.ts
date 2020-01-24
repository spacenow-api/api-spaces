import {
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
} from "sequelize-typescript";
import bcryptjs from "bcryptjs";
import uuidV4 from "uuid/v4";
import { Role } from "./role.model";

@Table
export class User extends Model<User> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @Unique
  @IsEmail
  @Column
  email!: string;

  @Length({ min: 8, max: 12 })
  @Column
  password!: string;

  @Default(false)
  @Column
  isEmailConfirmed!: boolean;

  @Default(true)
  @Column
  isActive!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @HasMany(() => Role)
  role!: Role[];

  @BeforeCreate
  static async generateId(instance: User) {
    instance.id = uuidV4();
  }

  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.password = bcryptjs.hashSync(
      instance.password,
      bcryptjs.genSaltSync(8)
    );
  }
}
