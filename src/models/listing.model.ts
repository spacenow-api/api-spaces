import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  IsUUID,
  IsAlpha,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
  BeforeCreate,
  HasMany,
  ForeignKey
} from 'sequelize-typescript';

import uuidV4 from 'uuid/v4';

@Table
export class Listing extends Model<Listing> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;
}
