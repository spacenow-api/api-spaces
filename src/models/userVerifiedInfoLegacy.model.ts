import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  BelongsTo,
  ForeignKey,
  AutoIncrement
} from "sequelize-typescript";

import { UserLegacy } from "./";

@Table({
  tableName: "UserVerifiedInfo"
})
export class UserVerifiedInfoLegacy extends Model<UserVerifiedInfoLegacy> {

  @AutoIncrement
  @PrimaryKey
  @AllowNull(false)
  @Column
  id!: number;

  @ForeignKey(() => UserLegacy)
  @AllowNull(false)
  @Column
  userId!: string;

  @Default(0)
  @Column
  isEmailConfirmed?: number;

  @Default(0)
  @Column
  isFacebookConnected?: number;

  @Default(0)
  @Column
  isGoogleConnected?: number;

  @Default(0)
  @Column
  isIdVerification?: number;

  @Default(0)
  @Column
  isPhoneVerified?: number;

  @BelongsTo(() => UserLegacy)
  userVerifiedInfo: UserLegacy | undefined;
}
