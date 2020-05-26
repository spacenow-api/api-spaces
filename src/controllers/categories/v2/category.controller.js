const { Router, Request, Response, NextFunction } = require("express");
const NodeCache = require("node-cache");

const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");
const HttpException = require("../../../helpers/exceptions/HttpException");

const { V2Category, V2CategorySpecification, V2Tag } = require("../../../models/v2");
const { ListSettings, SubcategoryBookingPeriod } = require("../../../models");

const CACHE_KEY = "_categories_";

class V2CategoryController {
  router = Router();
  cache = new NodeCache({ stdTTL: 259200 });

  constructor() {
    this.router.get(`/v2/root-categories`, this.getRootCategories);
    this.router.get(`/v2/categories`, this.getCategories);
    this.router.get(`/v2/category/:id`, this.getCategory);
    this.router.get(`/v2/category/:id/tags`, this.getCategoryTag);
    this.router.get(`/v2/category/:id/specifications`, this.getCategorySpecification);
    this.router.get(`/v2/category/:id/activities`, this.getCategoryActivities);
    this.router.get(`/v2/category/:id/styles`, this.getCategoryStyles);
    this.router.get(`/v2/category/:id/rules`, this.getCategoryRules);
    this.router.get(`/v2/category/:id/amenities`, this.getCategoryAmenities);
    this.router.get(`/v2/category/:id/features`, this.getCategoryFeatures);
    this.router.get(`/v2/category/:id/booking-period`, this.getCategoryBookingPeriod);
    this.router.get(`/v2/category/:id/access`, this.getCategoryAccess);
    this.router.get(`/v2/category/:id/checkin-types`, this.getCategoryCheckinTypes);
    this.router.post(`/v2/category`, this.postCategory);
  }

  getRootCategories = async (req, res, next) => {
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

  getCategories = async (req, res, next) => {
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

  getCategory = async (req, res, next) => {
    const id = (req.params.id);
    const TYPE_ID = "111";
    if (!id) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    try {
      const category = await ListSettings.findOne({
        where: { id, isEnable: "1", typeId: TYPE_ID }
      });
      res.send(category);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryTag = async (req, res, next) => {
    const categoryId = (req.params.id);
    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { categoryId } };

    try {
      const result = await V2Tag.findAll(where);
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategorySpecification = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "117";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };

    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryActivities = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "120";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryStyles = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "119";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryFeatures = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "118";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryRules = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "14";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryAmenities = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "115";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryAccess = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "121";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryCheckinTypes = async (req, res, next) => {
    const categoryId = (req.params.id);
    const TYPE_ID = "113";

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      const listSettings = await V2CategorySpecification.findAll(where);
      const result = new Array();
      for (const item of listSettings) {
        const settingsObj = await ListSettings.findOne({
          where: { id: item.listSettingsSpecificationId, isEnable: "1", typeId: TYPE_ID }
        });
        if (settingsObj) {
          result.push(settingsObj);
        }
      }
      res.send(result);
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getCategoryBookingPeriod = async (req, res, next) => {
    const categoryId = (req.params.id);

    if (!categoryId) {
      throw new HttpException(400, `Category ID must be provided.`);
    }
    const where = { where: { listSettingsParentId: categoryId } };
    try {
      res.send(await SubcategoryBookingPeriod.findOne(where));
    } catch (err) {
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postCategory = async (req, res, next) => {
    const data = req.body;
    try {
      res.send(await V2Category.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putCategory = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const category = await V2Category.findByPk(id);
      if (!category) throw new Error(`Category ${id} not found.`);
      await category.update(data);
      res.send(await category.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
      const category = await V2Category.findByPk(id);
      if (!category) throw new Error(`Category ${id} not found.`);
      await category.destroy();
      res.send(`Category ${id} deleted.`);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2CategoryController;
