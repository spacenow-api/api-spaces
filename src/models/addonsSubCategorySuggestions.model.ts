import {
  PrimaryKey,
  Table,
  Column,
  Model,
  AllowNull,
  ForeignKey,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";

import { ListSettings } from './'

@Table({
  tableName: 'AddonsSubCategorySuggestions'
})
export class AddonsSubCategorySuggestions extends Model<AddonsSubCategorySuggestions> {

  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => ListSettings)
  @Column({ field: "id" })
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
