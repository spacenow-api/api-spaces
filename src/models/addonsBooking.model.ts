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
  tableName: 'AddonsBooking'
})
export class AddonsBooking extends Model<AddonsBooking> {

  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: string;

  @AllowNull(false)
  @Column
  bookingId!: string;

  @AllowNull(false)
  @Column
  addonId!: string;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

}
