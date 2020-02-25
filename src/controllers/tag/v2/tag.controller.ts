import { Router, Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";
import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";

import { V2Tag } from "../../../models/v2";

const CACHE_KEY = "_tags_";

class V2TagController {
  private router = Router();
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.router.get(`/v2/tags`, this.getTags);
    this.router.get(`/v2/tag/:id`, this.getTag);
    this.router.post(`/v2/tag`, authMiddleware, this.postTag);
    this.router.put(`/v2/tag/:id`, authMiddleware, this.putTag);
    this.router.delete(`/v2/tag/:id`, authMiddleware, this.deleteTag);
  }

  getTags = async (req: Request, res: Response, next: NextFunction) => {
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

  getTag = async (req: Request, res: Response, next: NextFunction) => {
    const id = <string>(<unknown>req.params.id);
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

  postTag = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      res.send(await V2Tag.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putTag = async (req: Request, res: Response, next: NextFunction) => {
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

  deleteTag = async (req: Request, res: Response, next: NextFunction) => {
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
