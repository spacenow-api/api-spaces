const { Router, Request, Response, NextFunction } = require("express");
const NodeCache = require("node-cache");
const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");
const HttpException = require("../../../helpers/exceptions/HttpException");

const { V2Tag } = require("../../../models/v2");

const CACHE_KEY = "_tags_";

class V2TagController {
  router = Router();
  cache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.router.get(`/v2/tags`, this.getTags);
    this.router.get(`/v2/tag/:id`, this.getTag);
    this.router.post(`/v2/tag`, authMiddleware, this.postTag);
    this.router.put(`/v2/tag/:id`, authMiddleware, this.putTag);
    this.router.delete(`/v2/tag/:id`, authMiddleware, this.deleteTag);
  }

  getTags = async (req, res, next) => {
    const cacheData = this.cache.get(CACHE_KEY);
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    try {
      const result = await V2Tag.findAll();
      this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getTag = async (req, res, next) => {
    const id = (req.params.id);
    if (!id) {
      throw new HttpException(400, `Tag ID must be provided.`);
    }
    const cacheData = this.cache.get(`${CACHE_KEY}_${id}`);
    const where = { where: { parentId: id } };
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    try {
      const result = await V2Tag.findAll(where);
      this.cache.set(`${CACHE_KEY}_${id}`, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postTag = async (req, res, next) => {
    const data = req.body;
    try {
      res.send(await V2Tag.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putTag = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const tag = await V2Tag.findByPk(id);
      if (!tag) throw new Error(`Tag ${id} not found.`);
      await tag.update(data);
      res.send(await tag.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteTag = async (req, res, next) => {
    const id = req.params.id;
    try {
      const tag = await V2Tag.findByPk(id);
      if (!tag) throw new Error(`Tag ${id} not found.`);
      await tag.destroy();
      res.send(`Tag ${id} deleted.`);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2TagController;
