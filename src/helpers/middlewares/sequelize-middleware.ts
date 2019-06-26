import { NextFunction, Response, Request } from 'express';

import { sequelize } from '../../models';

export default (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.debug('Running Sequelize sync process.');
  // sequelize.sync();
  next();
};
