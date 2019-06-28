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
  tableName: 'ListSettingsParent'
})
export class ListSettingsParent extends Model<ListSettingsParent> {
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: number;

  @Default('0')
  @AllowNull(false)
  @Column
  listSettingsParentId!: number;

  @AllowNull(false)
  @Column
  listSettingsChildId!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
