
//@Table({
//  tableName: 'Inspection'
//})
export class Inspection extends Model {
  id!;

  guestId!;

  listingId!;

  messageId!;

  status!;

  date!;

  time!;

  createdAt;

  updatedAt;

  message!;
}
