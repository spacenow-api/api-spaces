
//@Table({
//  tableName: 'Location'
//})
export class Location extends Model {
  id!;

  userId!;

  country;

  address1;

  address2;

  buildingName;

  city;

  state;

  zipcode;

  lat;

  lng;

  placeId;

  createdAt;

  updatedAt;

  listing!;
}
