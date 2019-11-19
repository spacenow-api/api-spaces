import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  PrimaryKey,
  AllowNull,
  Default,
  AutoIncrement,
  DataType
} from "sequelize-typescript";

@Table({
  tableName: "ExternalClicks"
})
export class ExternalClicks extends Model<ExternalClicks> {

  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @Column
  userId!: string;

  @AllowNull(false)
  @Column
  listingId!: number;

  @Default(1)
  @AllowNull(false)
  @Column
  clicks!: number;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;
}
