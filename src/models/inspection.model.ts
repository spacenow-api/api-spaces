import {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  DataType,
  BelongsTo
} from 'sequelize-typescript'

import { Message } from '.'

@Table({
  tableName: 'Inspection'
})
export class Inspection extends Model<Inspection> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number

  @AllowNull(false)
  @Column
  guestId!: string

  @AllowNull(false)
  @Column
  listingId!: number

  @AllowNull(false)
  @Column
  messageId!: string

  @AllowNull(false)
  @Default('active')
  @Column(DataType.ENUM('active', 'completed', 'canceled'))
  status!: string

  @Column
  date!: Date

  @Column
  time!: string

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @BelongsTo(() => Message, 'messageId')
  message!: Message;
}
