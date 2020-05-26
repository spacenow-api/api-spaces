const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default
} = require("sequelize-typescript");

//@Table({
//  tableName: "Reviews"
//})
export class Reviews extends Model {
  
  id!;

  reservationId!;

  listId!;

  authorId!;

  userId!;

  reviewContent;

  privateFeedback;

  ratingOverall!;

  ratingCheckIn!;

  ratingHost!;

  ratingValue!;

  ratingCleanliness!;

  ratingLocation!;

  parentId;

  automated;

  isAdmin;

  createdAt!;

  updatedAt!;
}
