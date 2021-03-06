import {
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
} from 'sequelize-typescript'
import { Message } from '.'

@Table({
  tableName: 'MessageItem'
})
export class MessageItem extends Model<MessageItem> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string

  @IsUUID(4)
  @AllowNull(false)
  @Column
  messageId!: string

  @IsUUID(4)
  @AllowNull(false)
  @Column
  sentBy!: string

  @Column
  content!: string

  @Column
  isRead?: boolean

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @BelongsTo(() => Message, 'id')
  message!: Message
}
