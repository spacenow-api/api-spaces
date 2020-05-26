
//@Table({
//  tableName: 'ListingAccessHours'
//})
export class ListingAccessHours extends Model {
  id!;

  listingAccessDaysId!;

  weekday!;

  openHour;

  closeHour;

  allday!;

  createdAt!;

  updatedAt!;
}
