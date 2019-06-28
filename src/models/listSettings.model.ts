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
  tableName: 'ListSettings'
})
export class ListSettings extends Model<ListSettings> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  typeId!: number;

  @Column
  itemName?: string;

  @Column
  otherItemName?: string;

  @Column
  description?: string;

  @Column
  maximum?: number;

  @Column
  minimum?: number;

  @Column
  startValue?: number;

  @Column
  endValue?: number;

  @Column
  step?: string;

  @Default('1')
  @Column
  isEnable?: string;

  @Column
  photo?: string;

  @Column
  photoType?: string;

  @AllowNull(false)
  @Column
  isSpecification!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;

  @Column
  specData?: string;
}
