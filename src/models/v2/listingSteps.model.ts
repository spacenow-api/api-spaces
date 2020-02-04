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
  DataType,
  BelongsTo,
  ForeignKey,
  AfterUpdate
} from "sequelize-typescript";

import { V2Listing } from ".";

@Table({
  tableName: "UserListingSteps"
})
export class V2ListingSteps extends Model<V2ListingSteps> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => V2Listing)
  @Column
  listingId?: number;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step1!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step2!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step3!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step4!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step5!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step6!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step7!: string;

  @AllowNull(false)
  @Default("inactive")
  @Column(DataType.ENUM("inactive", "active", "completed"))
  step8!: string;

  @Column(DataType.VIRTUAL(DataType.STRING, ["completed"]))
  get completed(this: V2ListingSteps): number {
    var completed = 0;
    completed += this.step1 === "completed" ? 1 : 0;
    completed += this.step2 === "completed" ? 1 : 0;
    completed += this.step3 === "completed" ? 1 : 0;
    completed += this.step4 === "completed" ? 1 : 0;
    completed += this.step5 === "completed" ? 1 : 0;
    completed += this.step6 === "completed" ? 1 : 0;
    completed += this.step7 === "completed" ? 1 : 0;
    completed += this.step8 === "completed" ? 1 : 0;
    return (completed / 8) * 100;
  }

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BelongsTo(() => V2Listing)
  listing!: V2Listing;

  @AfterUpdate
  static async verifyIsReady(instance: V2ListingSteps) {
    const id = <string>(<unknown>instance.listingId);
    const where = {
      where: { id }
    };
    if (instance.completed === 100)
      return await V2Listing.update({ isReady: true }, where);
    else return await V2Listing.update({ isReady: false }, where);
  }
}
