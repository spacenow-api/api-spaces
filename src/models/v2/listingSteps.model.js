const {
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
} = require("sequelize-typescript");

const { V2Listing } = require(".");

//@Table({
//  tableName: "UserListingSteps"
//})
export class V2ListingSteps extends Model {
  id!;

  listingId;

  step1!;

  step2!;

  step3!;

  step4!;

  step5!;

  step6!;

  step7!;

  step8!;

  get completed(this) {
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

  createdAt!;

  updatedAt!;

  listing!;

  static async verifyIsReady(instance) {
    const id = (instance.listingId);
    const where = {
      where: { id }
    };
    if (instance.completed === 100)
      return await V2Listing.update({ isReady: true }, where);
    else return await V2Listing.update({ isReady: false }, where);
  }
}
