import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  BelongsTo
} from 'sequelize-typescript'
import { Inspection } from '.'

@Table({
  tableName: 'MessageItem'
})
export class MessageItem extends Model<MessageItem> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number

  @AllowNull(false)
  @Column
  messageId!: string

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

  @BelongsTo(() => Inspection, 'messageId')
  messages!: Inspection
}
