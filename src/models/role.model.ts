import {
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
} from "sequelize-typescript";
import uuidV4 from "uuid/v4";
import { User } from "./user.model";

@Table
export class Role extends Model<Role> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @Default("guest")
  @Column
  name!: string;

  @Default(true)
  @Column
  isActive!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @BeforeCreate
  static async generateId(instance: Role) {
    instance.id = uuidV4();
  }
}
