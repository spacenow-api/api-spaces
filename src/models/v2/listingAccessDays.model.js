const {
  Table,
  Column,
  AutoIncrement,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  Default,
  AfterCreate,
  HasMany,
  ForeignKey,
  AfterUpdate,
  BeforeUpdate
} = require("sequelize-typescript");

const { format } = require("date-fns");

const { V2ListingAccessHours, V2Listing } = require("./");

//@Table({
//  tableName: "ListingAccessDays"
//})
export class V2ListingAccessDays extends Model {
  id!;

  listingId!;

  mon!;

  tue!;

  wed!;

  thu!;

  fri!;

  sat!;

  sun!;

  all247!;

  createdAt!;

  updatedAt!;

  accessHours!;

  static createAccessHours = async(instance) => {
    const openHour = new Date(`${format(new Date(), "YYYY-MM-DD")}T09:00`);
    const closeHour = new Date(`${format(new Date(), "YYYY-MM-DD")}T17:00`);
    for (let index = 0; index <= 6; index++) {
      await V2ListingAccessHours.create({
        listingAccessDaysId: instance.id,
        weekday: index,
        openHour: openHour,
        closeHour: closeHour,
        allday: false,
        peaktime: false
      });
    }
  }
}
