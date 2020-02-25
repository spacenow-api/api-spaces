import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  PrimaryKey,
  Unique,
  Default,
  BelongsToMany,
  BeforeCreate
} from "sequelize-typescript";

import { V2ListingAmenities, V2Listing } from "./";

import uuidV4 from "uuid/v4";

@Table({
  tableName: "amenity"
})
export class V2Amenity extends Model<V2Amenity> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @Unique
  @Column
  name!: string;

  @Column
  slug!: string;

  @Default(0)
  @Column
  order!: number;

  @Default(true)
  @Column({ field: "is_active" })
  isActive!: boolean;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;

  @BelongsToMany(
    () => V2Listing,
    () => V2ListingAmenities,
    "amenityId"
  )
  listings!: V2Listing[];

  @BeforeCreate
  static async generateId(instance: V2Amenity) {
    return (instance.id = uuidV4());
  }

  @BeforeCreate
  static async generateSlug(instance: V2Amenity) {
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
