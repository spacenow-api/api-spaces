const uuidV4 = require("uuid/v4");

//@Table({
//  tableName: "category"
//})
export class Category extends Model {
     id!;

     name!;

   slug!;

      parentId;

    order!;

    isActive!;

    createdAt!;

    updatedAt!;

   children;

   static async generateId(instance) {
    instance.id = uuidV4();
  }

   static async generateSlug(instance) {
    const a = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;";
    const b = "aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------";
    const p = new RegExp(a.split("").join("|"), "g");
    instance.slug = instance.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(p, c => b.charAt(a.indexOf(c)))
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
}
