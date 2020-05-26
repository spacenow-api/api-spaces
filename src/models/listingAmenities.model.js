
//@Table({
//  tableName: 'ListingAmenities'
//})
export class ListingAmenities extends Model {
  id!;

  listingId!;

  listSettingsId!;

  amount;

  quantity;

  currency;

  settings;

  type;

  createdAt!;

  updatedAt!;
}
