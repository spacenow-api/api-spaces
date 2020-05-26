
const uuidV4 = require("uuid/v4");

//@Table({
//  tableName: "category_booking_period"
//})
export class CategoryBookingPeriod extends Model {
  id!;

  categoryId;

  monthly;

  weekly;

  daily;

  hourly;

  createdAt!;

  updatedAt!;

  static async generateId(instance) {
    instance.id = uuidV4();
  }
}
