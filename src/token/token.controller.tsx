import { Request } from 'express';

class TokenController {

  public getToken(request: Request): string {
    if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
      return request.headers.authorization.split(' ')[1];
    } else if (request.query && request.query.token) {
      return request.query.token;
    } else if (request.cookies && request.cookies.authorization) {
      return request.cookies.authorization;
    }
    return '';
  }

}
 
export default TokenController