import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default
} from "sequelize-typescript";

@Table({
  tableName: "Reviews"
})
export class Reviews extends Model<Reviews> {
  
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  reservationId!: number;

  @AllowNull(false)
  @Column
  listId!: number;

  @AllowNull(false)
  @Column
  authorId!: string;

  @AllowNull(false)
  @Column
  userId!: string;

  @AllowNull(true)
  @Column
  reviewContent?: string;

  @AllowNull(true)
  @Column
  privateFeedback?: string;

  @Default(0)
  @AllowNull(false)
  @Column
  ratingOverall!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  ratingCheckIn!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  ratingHost!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  ratingValue!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  ratingCleanliness!: number;

  @Default(0)
  @AllowNull(false)
  @Column
  ratingLocation!: number;

  @Default(0)
  @AllowNull(true)
  @Column
  parentId?: number;

  @Default(0)
  @AllowNull(true)
  @Column
  automated?: number;

  @Default(0)
  @AllowNull(true)
  @Column
  isAdmin?: number;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;
}
