const {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  IsAlpha,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
  BeforeCreate,
  HasMany,
  BelongsTo,
  ForeignKey,
  BelongsToMany
} = require("sequelize-typescript");

const uuidV4 = require("uuid/v4");

const { Category, Listing, ListingTopic } = require("./");

//@Table({
//  tableName: "topic"
//})
export class Topic extends Model {
  id!;

  name!;

  slug!;

  categoryId;

  order!;

  isActive!;

  createdAt!;

  updatedAt!;

  // @BelongsToMany(() => ListingTopic, "topicId")
  // listings!;
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
