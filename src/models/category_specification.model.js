const uuidV4 = require("uuid/v4");

//@Table({
//  tableName: "category_specification"
//})
export class CategorySpecification extends Model {
  id!;

  categoryId;

  createdAt!;

  updatedAt!;

  static async generateId(instance) {
    instance.id = uuidV4();
  }
}
