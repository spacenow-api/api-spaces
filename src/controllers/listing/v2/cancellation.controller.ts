import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

import { V2Cancellation } from "../../../models/v2";

class V2CancellationController {
  private router = Router();

  constructor() {
    this.router.get(`/v2/cancellations`, this.getCancellations);
    this.router.get(`/v2/cancellation/:id`, this.getCancellation);
    this.router.post(`/v2/cancellation`, authMiddleware, this.postCancellation);
    this.router.put(`/v2/cancellation/:id`, authMiddleware, this.putCancellation);
    this.router.delete(`/v2/cancellation/:id`, authMiddleware, this.deleteCancellation);
  }

  getCancellations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await V2Cancellation.findAll());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCancellation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      res.send(await V2Cancellation.findByPk(id));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postCancellation = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      res.send(await V2Cancellation.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putCancellation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const cancellation = await V2Cancellation.findByPk(id);
      if (!cancellation) throw new Error(`Cancellation ${id} not found.`);
      await cancellation.update(data);
      res.send(await cancellation.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteCancellation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const cancellation = await V2Cancellation.findByPk(id);
      if (!cancellation) throw new Error(`Cancellation ${id} not found.`);
      await cancellation.destroy();
      res.send(`Cancellation ${id} deleted.`);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2CancellationController;
