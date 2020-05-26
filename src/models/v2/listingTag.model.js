const { Table, Column, Model, AllowNull, ForeignKey, CreatedAt, UpdatedAt } = require("sequelize-typescript");

const { V2Listing, V2Tag } = require("./");

//@Table({
//  tableName: "listing_tag"
//})
export class V2ListingTag extends Model {
     listingId!;

     tagId!;

   createdAt!;

   updatedAt!;
}
