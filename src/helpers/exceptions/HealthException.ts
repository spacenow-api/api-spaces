import HttpException from "./HttpException";

class HealthException extends HttpException {
  constructor() {
    super(200, `The application is health!`);
  }
}

export default HealthException;
