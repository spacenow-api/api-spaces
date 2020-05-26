
//@Table({
//  tableName: 'Message'
//})
export class Message extends Model {
  id!;

  listingId!;

  hostId!;

  guestId!;

  isRead;

  createdAt;

  updatedAt;

  messages!;

}
