import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import TokenController from '../../token/token.controller';

async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const token = new TokenController().getToken(request);
  if (token) {
    const secret:string = process.env.JWT_SECRET || 'Spacenow';
    try {
      await jwt.verify(token, secret);
      next()
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}
 
export default authMiddleware;