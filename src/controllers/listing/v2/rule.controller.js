const { Router, Request, Response, NextFunction } = require("express");

const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");

const { V2Rule } = require("../../../models/v2");

class V2RuleController {
  router = Router();

  constructor() {
    this.router.get(`/v2/rules`, this.getRules);
    this.router.get(`/v2/rule/:id`, this.getRule);
    this.router.post(`/v2/rule`, authMiddleware, this.postRule);
    this.router.put(`/v2/rule/:id`, authMiddleware, this.putRule);
    this.router.delete(`/v2/rule/:id`, authMiddleware, this.deleteRule);
  }

  getRules = async (req, res, next) => {
    try {
      res.send(await V2Rule.findAll());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getRule = async (req, res, next) => {
    const id = req.params.id;
    try {
      res.send(await V2Rule.findByPk(id));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postRule = async (req, res, next) => {
    const data = req.body;
    try {
      res.send(await V2Rule.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putRule = async (req, res, next) => {
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

  deleteRule = async (req, res, next) => {
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
