import { Router, Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";

import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";
import HttpException from "../../../helpers/exceptions/HttpException";

import { V2Category, V2CategorySpecification } from "../../../models/v2";

const CACHE_KEY = "_categories_";

class V2CategoryController {
  private router = Router();
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.router.get(`/v2/root-categories`, this.getRootCategories);
    this.router.get(`/v2/categories`, this.getCategories);
    this.router.get(`/v2/category/:id`, this.getCategory);
    this.router.get(
      `/v2/category/:id/specifications`,
      this.getCategorySpecification
    );
  }

  getRootCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const cacheData = this.cache.get(`_root${CACHE_KEY}`);
    const where = { where: { parentId: null } };
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    try {
      const result = await V2Category.findAll(where);
      this.cache.set(`_root${CACHE_KEY}`, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    const cacheData = this.cache.get(CACHE_KEY);
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    try {
      const result = await V2Category.findAll();
      this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = <string>(<unknown>req.params.id);
    if (!id) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const cacheData = this.cache.get(`_sub${CACHE_KEY}_${id}`);
    const where = { where: { parentId: id } };
    if (cacheData) {
      res.send(cacheData);
      return;
    }

    try {
      const result = await V2Category.findAll(where);
      this.cache.set(`_sub${CACHE_KEY}`, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategorySpecification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const categoryId = <string>(<unknown>req.params.id);
    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { categoryId } };

    try {
      const result = await V2CategorySpecification.findAll(where);
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2CategoryController;
