const { NextFunction, Response, Request } = require('express');

export default (
  request,
  response,
  next
) => {
  console.debug(`${request.method} ${request.path}`);
  next();
};
