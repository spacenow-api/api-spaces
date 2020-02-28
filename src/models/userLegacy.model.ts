import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsEmail,
  IsUUID,
  PrimaryKey,
  Default,
  BeforeCreate,
  AllowNull,
  HasOne,
  DataType,
  HasMany
} from 'sequelize-typescript'

import bcryptjs from 'bcryptjs'

import uuidV4 from 'uuid/v4'
import { UserProfileLegacy } from './'
import { UserVerifiedInfoLegacy } from './'
import { SavedListing } from '.'

@Table({
  tableName: 'User'
})
export class UserLegacy extends Model<UserLegacy> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string

  @IsEmail
  @AllowNull(false)
  @Column
  email!: string

  @Default('spacenow')
  @Column
  password!: string

  @Default(0)
  @Column
  emailConfirmed?: number

  @Column
  type?: string

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @Default(0)
  @Column
  userBanStatus?: number

  @Default('user')
  @Column
  role?: string

  @Default('spacenow')
  @Column(DataType.ENUM('spacenow', 'wework', 'generic', 'external'))
  provider?: string

  @Column
  voucherCode?: string

  @Default('guest')
  @Column(DataType.ENUM('host', 'guest'))
  userType?: string

  @HasOne(() => UserProfileLegacy)
  profile: UserProfileLegacy | undefined

  @HasOne(() => UserVerifiedInfoLegacy)
  userVerifiedInfo: UserVerifiedInfoLegacy | undefined

  @HasMany(() => SavedListing, 'userId')
  user!: SavedListing | undefined

  static getPasswordHash(value: string): string {
    return bcryptjs.hashSync(value, bcryptjs.genSaltSync(8))
  }

  @BeforeCreate
  static generateId(instance: UserLegacy): void {
    instance.id = uuidV4()
  }

  @BeforeCreate
  static hashPassword(instance: UserLegacy): void {
    instance.password = UserLegacy.getPasswordHash(instance.password)
  }
}
