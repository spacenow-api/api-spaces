import { NextFunction, Response, Request } from "express";
import { sequelize } from '../../models'

export default (request: Request, response:Response, next: NextFunction):void => {
  sequelize.sync();
  next();
};
