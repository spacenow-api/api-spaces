const { Table, Column, Model, CreatedAt, UpdatedAt, IsUUID, IsAlpha, PrimaryKey, AllowNull, Unique, Default, BeforeCreate, HasMany, BelongsToMany, ForeignKey } = require("sequelize-typescript");

const { V2Tag } = require("./");

const uuidV4 = require("uuid/v4");

//@Table({
//  tableName: "category"
//})
export class V2Category extends Model {
  id!;

  name!;

  slug!;

  parentId;

  order!;

  isActive!;

  createdAt!;

  updatedAt!;

  children;

  tags!;

  static async generateId(instance) {
    return (instance.id = uuidV4());
  }

  static async generateSlug(instance) {
    const a = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;";
    const b = "aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------";
    const p = new RegExp(a.split("").join("|"), "g");
    return (instance.slug = instance.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(p, c => b.charAt(a.indexOf(c)))
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, ""));
  }
}
