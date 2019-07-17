import { Request } from 'express';

class Token {

  public static get(req: Request): string {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies && req.cookies.authorization) {
      return req.cookies.authorization;
    }
    return '';
  }
}

export default Token
