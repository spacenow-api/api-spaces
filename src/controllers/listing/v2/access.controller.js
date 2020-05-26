const { Router, Request, Response, NextFunction } = require("express");

const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");

const { V2Feature } = require("../../../models/v2");

class V2FeatureController {
  router = Router();

  constructor() {
    this.router.get(`/v2/features`, this.getFeatures);
    this.router.get(`/v2/feature/:id`, this.getFeature);
    this.router.post(`/v2/feature`, authMiddleware, this.postFeature);
    this.router.put(`/v2/feature/:id`, authMiddleware, this.putFeature);
    this.router.delete(`/v2/feature/:id`, authMiddleware, this.deleteFeature);
  }

  getFeatures = async (req, res, next) => {
    try {
      res.send(await V2Feature.findAll());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getFeature = async (req, res, next) => {
    const id = req.params.id;
    try {
      res.send(await V2Feature.findByPk(id));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postFeature = async (req, res, next) => {
    const data = req.body;
    try {
      res.send(await V2Feature.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putFeature = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const feature = await V2Feature.findByPk(id);
      if (!feature) throw new Error(`Feature ${id} not found.`);
      await feature.update(data);
      res.send(await feature.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteFeature = async (req, res, next) => {
    const id = req.params.id;
    try {
      const feature = await V2Feature.findByPk(id);
      if (!feature) throw new Error(`Feature ${id} not found.`);
      await feature.destroy();
      res.send(`Feature ${id} deleted.`);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2FeatureController;
