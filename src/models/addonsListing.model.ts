import {
  IsUUID,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Column,
  Model,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: 'AddonsListing'
})
export class AddonsListing extends Model<AddonsListing> {

  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @Column
  listingId!: number;

  @AllowNull(false)
  @Column
  description!: string;

  @AllowNull(false)
  @Column
  key!: string;

  @AllowNull(false)
  @Default(0)
  @Column
  value!: number;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

}
