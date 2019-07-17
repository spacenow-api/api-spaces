import { Router, Request, Response, NextFunction } from "express";
import HealthException from "../../helpers/exceptions/HealthException";

class HealthController {
  public path = "/health";
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(this.path, this.health);
  }

  private health = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    response.send(new HealthException());
  };
}

export default HealthController;
