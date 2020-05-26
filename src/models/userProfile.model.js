const {
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
  HasOne,
  HasMany
} = require('sequelize-typescript');

const { Listing, SavedListing } = require('.');

//@Table({
//  tableName: 'UserProfile'
//})
export class UserProfile extends Model {
  userId!;

  profileId!;

  firstName;

  lastName;

  displayName;

  dateOfBirth;

  picture;

  gender;

  phoneNumber;

  preferredLanguage;

  preferredCurrency;

  info;

  location;

  createdAt!

  updatedAt!

  stripeCusId;

  country;

  verificationCode;

  countryCode;

  customerId;

  accountId;

  userLocationId;

  profileType;

  companyName;

  companyId;

  contactJobRole;

  host!;

  user!;
}
