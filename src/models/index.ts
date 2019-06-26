import { Sequelize } from 'sequelize-typescript';

import * as config from '../config';

import { Listing } from './listing.model';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.dbEndpoint,
  database: config.dbSchema,
  username: config.dbUsername,
  password: config.dbPassword,
  logging: true
});

sequelize.addModels([Listing]);

export { Listing } from './listing.model';
