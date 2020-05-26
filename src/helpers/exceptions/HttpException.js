const { BaseError } = require('sequelize');

export default class HttpException extends BaseError {
  status;
  message;
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
