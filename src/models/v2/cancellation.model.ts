import {
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
} from "sequelize-typescript";

import uuidV4 from "uuid/v4";

@Table({
  tableName: "Cancellation"
})
export class V2Cancellation extends Model<V2Cancellation> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @IsAlpha
  @Column
  policyName!: string;

  @IsAlpha
  @Column
  policyContent!: string;

  @Default(true)
  @Column({ field: "isEnable" })
  isActive!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
