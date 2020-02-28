import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  PrimaryKey,
  Default,
  AllowNull,
  AutoIncrement,
  Unique,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";

import { UserLegacy } from "./";

@Table({
  tableName: "UserProfile"
})
export class UserProfileLegacy extends Model<UserProfileLegacy> {
  @IsUUID(4)
  @PrimaryKey
  @ForeignKey(() => UserLegacy)
  @AllowNull(false)
  @Column
  userId!: string;

  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column
  profileId!: number;

  @Column
  firstName?: string;

  @Column
  lastName?: string;

  @Column
  displayName?: string;

  @Column
  dateOfBirth?: string;

  @Default('')
  @Column
  picture?: string;

  @Column
  gender?: string;

  @Column
  phoneNumber?: string;

  @Column
  preferredLanguage?: string;

  @Column
  preferredCurrency?: string;

  @Column
  info?: string;

  @Column
  location?: string;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Column
  stripeCusId?: string;

  @Default(1)
  @Column
  country?: number;

  @Column
  verificationCode?: number;

  @Column
  countryCode?: string;

  @Column
  customerId?: string;

  @Column
  accountId?: string;

  @Column
  userLocationId?: number;

  @Column
  profileType?: string;

  @Column
  companyName?: string;

  @Column
  companyId?: string;

  @Column
  contactJobRole?: string;

  @BelongsTo(() => UserLegacy)
  profile: UserLegacy | undefined;
}
