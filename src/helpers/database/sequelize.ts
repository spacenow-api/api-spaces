import { Sequelize } from 'sequelize-typescript';

import * as config from '../../config';

import { Listing, ListingData } from './../../models';

let sequelize: Sequelize;

const initialize = () => {
  if (!sequelize) {
    console.debug('Initializing database.');
    sequelize = new Sequelize({
      dialect: 'mysql',
      host: config.dbEndpoint,
      database: config.dbSchema,
      username: config.dbUsername,
      password: config.dbPassword,
      logging: config.DEBUG ? console.debug : false
    });
    sequelize.addModels([Listing, ListingData]);
  }
};

export default { initialize };
