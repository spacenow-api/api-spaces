import HttpException from "./HttpException";
 
class WrongCredentialsException extends HttpException {
  constructor() {
    super(400, `Wrong Credentials`);
  }
}
 
export default WrongCredentialsException;