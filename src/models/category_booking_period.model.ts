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
  ForeignKey,
  BelongsTo,
  BeforeCreate
} from "sequelize-typescript";

import uuidV4 from "uuid/v4";

import { Category } from ".";

@Table({
  tableName: "category_booking_period"
})
export class CategoryBookingPeriod extends Model<CategoryBookingPeriod> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column({ field: "category_id" })
  categoryId?: string;

  @Default(0)
  @Column
  monthly?: number;

  @Default(0)
  @Column
  weekly?: number;

  @Default(0)
  @Column
  daily?: number;

  @Default(0)
  @Column
  hourly?: number;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;

  @BelongsTo(() => Category, "categoryId")
  @BeforeCreate
  static async generateId(instance: CategoryBookingPeriod) {
    instance.id = uuidV4();
  }
}
