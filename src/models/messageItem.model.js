const {
  Table,
  Column,
  IsUUID,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  HasOne,
  BelongsTo
} = require('sequelize-typescript');
const { Message } = require('.');

//@Table({
//  tableName: 'MessageItem'
//})
export class MessageItem extends Model {
  id!

  messageId!

  sentBy!

  content!

  isRead;

  createdAt;

  updatedAt;

  message!: Message
}
