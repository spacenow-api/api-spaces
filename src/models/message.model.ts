import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  IsUUID,
  HasMany,
  BelongsTo
} from 'sequelize-typescript'

import { MessageItem } from '.'

@Table({
  tableName: 'Message'
})
export class Message extends Model<Message> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string

  @AllowNull(false)
  @Column
  listingId!: number

  @IsUUID(4)
  @AllowNull(false)
  @Column
  hostId!: string

  @IsUUID(4)
  @AllowNull(false)
  @Column
  guestId!: string

  @Column
  isRead?: boolean

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @HasMany(() => MessageItem, 'messageId')
  messages!: MessageItem[]

}
