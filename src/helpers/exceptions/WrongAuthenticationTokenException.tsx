import HttpException from "./HttpException";
 
class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(400, `Wrong authentication token exception!`);
  }
}
 
export default WrongAuthenticationTokenException;