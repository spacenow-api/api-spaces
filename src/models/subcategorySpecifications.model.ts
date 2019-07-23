import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  DataType
} from 'sequelize-typescript';

@Table({
  tableName: 'SubcategorySpecifications'
})
export class SubcategorySpecifications extends Model<SubcategorySpecifications> {

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  listSettingsParentId!: number;

  @AllowNull(false)
  @Column
  listSettingsSpecificationId!: number;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
