const { Router, Request, Response, NextFunction } = require("express");
const HealthException = require("../../helpers/exceptions/HealthException");

class HealthController {
   path = "/health";
   router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get(this.path, this.health);
  }

  health = (
    request,
    response,
    next
  ) => {
    next(new HealthException());
  };
}

export default HealthController;
