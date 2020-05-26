const { ValidationError } = require('sequelize');

const HttpException = require('../exceptions/HttpException');

export default (err, req, res, next) => {
  if (err) {
    if (err instanceof ValidationError) {
      const { errors } = err
      const message = errors.map((error) => error.message)[0];
      next(new HttpException(400, message));
    }
    next(new HttpException(err.status, err.message));
  } else {
    next(new HttpException(500, ''));
  }
};
