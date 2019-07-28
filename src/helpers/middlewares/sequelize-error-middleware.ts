import { Request, Response, NextFunction } from 'express';
import { ValidationError, ValidationErrorItem } from 'sequelize';

import HttpException from '../exceptions/HttpException';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof ValidationError) {
      const { errors } = err
      const message = errors.map((error: ValidationErrorItem) => error.message)[0];
      next(new HttpException(400, message));
    }
    next(new HttpException(err.status, err.message));
  } else {
    next(new HttpException(500, ''));
  }
};
