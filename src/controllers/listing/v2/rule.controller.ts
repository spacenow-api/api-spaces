import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

import { V2Rule } from "../../../models/v2";

class V2RuleController {
  private router = Router();

  constructor() {
    this.router.get(`/v2/rules`, this.getRules);
    this.router.get(`/v2/rule/:id`, this.getRule);
    this.router.post(`/v2/rule`, authMiddleware, this.postRule);
    this.router.put(`/v2/rule/:id`, authMiddleware, this.putRule);
    this.router.delete(`/v2/rule/:id`, authMiddleware, this.deleteRule);
  }

  getRules = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await V2Rule.findAll());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getRule = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      res.send(await V2Rule.findByPk(id));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postRule = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      res.send(await V2Rule.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putRule = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const rule = await V2Rule.findByPk(id);
      if (!rule) throw new Error(`Rule ${id} not found.`);
      await rule.update(data);
      res.send(await rule.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteRule = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const rule = await V2Rule.findByPk(id);
      if (!rule) throw new Error(`Rule ${id} not found.`);
      await rule.destroy();
      res.send(`Rule ${id} deleted.`);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2RuleController;
