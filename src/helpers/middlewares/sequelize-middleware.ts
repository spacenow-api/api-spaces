import { NextFunction, Response, Request } from 'express';

import { sequelize } from '../../models';

export default (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.debug('Running Sequelize sync process.');
  // todo: Looking for an approach to turn Sync database dynamicaly, to 'NOT' sync in production. [Arthemus]
  // sequelize.sync();
  next();
};
