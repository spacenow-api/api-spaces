import { Sequelize } from 'sequelize-typescript';
import * as config from '../config';
import { Category } from './category.model'

export const sequelize = new Sequelize({
  host: config.dbEndpoint,
  database: config.dbSchema,
  dialect: 'mysql',
  username: config.dbUsername,
  password: config.dbPassword,
  logging: false,
  storage: ':memory:'
});

sequelize.addModels([
  Category
])

export { Category } from './category.model';