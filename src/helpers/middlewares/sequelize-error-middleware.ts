import { Request, Response, NextFunction } from 'express';
import { ValidationError, ValidationErrorItem } from 'sequelize';

import HttpException from '../exceptions/HttpException';

export default ({ errors }: ValidationError, req: Request, res: Response, next: NextFunction) => {
  if (errors && errors.length > 0) {
    const message = errors.map((error: ValidationErrorItem) => error.message)[0];
    next(new HttpException(400, message));
  } else {
    next(new HttpException(500, ''));
  }
};
