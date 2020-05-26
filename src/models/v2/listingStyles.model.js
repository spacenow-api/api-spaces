const { V2Listing, V2Access } = require("./");

//@Table({
//  tableName: "ListingStyles"
//})
export class V2ListingStyles extends Model {
  // @ForeignKey(() => V2Listing)
  listingId!;

  // @ForeignKey(() => V2Access)
  // @IsUUID(4)
  accessId!;

  createdAt!;

  updatedAt!;
}
