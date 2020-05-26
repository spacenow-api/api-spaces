const { V2Listing, V2Access } = require("./");

//@Table({
//  tableName: "ListingAccess"
//})
export class V2ListingAccess extends Model {
  // @ForeignKey(() => V2Listing)
  listingId!;

  // @ForeignKey(() => V2Access)
  // @IsUUID(4)
  listSettingsId!;

  createdAt!;

  updatedAt!;
}
