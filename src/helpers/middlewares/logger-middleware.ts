import { NextFunction, Response, Request } from 'express';

export default (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.debug(`${request.method} ${request.path}`);
  next();
};
