const HttpException = require('./HttpException');

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(400, `Authentication token missing exception!`);
  }
}

export default AuthenticationTokenMissingException;
