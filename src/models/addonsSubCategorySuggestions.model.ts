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
  UpdatedAt
} from "sequelize-typescript";

@Table({
  tableName: 'AddonsSubCategorySuggestions'
})
export class AddonsSubCategorySuggestions extends Model<AddonsSubCategorySuggestions> {

  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @Column
  listSettingsId!: number;

  @AllowNull(false)
  @Column
  description!: string;

  @AllowNull(false)
  @Column
  key!: string;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

}
