const { Router, Request, Response, NextFunction } = require("express");

const { authMiddleware } = require("../../../helpers/middlewares/auth-middleware");
const sequelizeErrorMiddleware = require("../../../helpers/middlewares/sequelize-error-middleware");

const { V2Amenity } = require("../../../models/v2");

class V2AmenityController {
  router = Router();

  constructor() {
    this.router.get(`/v2/amenities`, this.getAmenities);
    this.router.get(`/v2/amenity/:id`, this.getAmenity);
    this.router.post(`/v2/amenity`, authMiddleware, this.postAmenity);
    this.router.put(`/v2/amenity/:id`, authMiddleware, this.putAmenity);
    this.router.delete(`/v2/amenity/:id`, authMiddleware, this.deleteAmenity);
  }

  getAmenities = async (req, res, next) => {
    try {
      res.send(await V2Amenity.findAll());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getAmenity = async (req, res, next) => {
    const id = req.params.id;
    try {
      res.send(await V2Amenity.findByPk(id));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postAmenity = async (req, res, next) => {
    const data = req.body;
    try {
      res.send(await V2Amenity.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putAmenity = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const amenity = await V2Amenity.findByPk(id);
      if (!amenity) throw new Error(`Amenity ${id} not found.`);
      await amenity.update(data);
      res.send(await amenity.reload());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  deleteAmenity = async (req, res, next) => {
    const id = req.params.id;
    try {
      const amenity = await V2Amenity.findByPk(id);
      if (!amenity) throw new Error(`Amenity ${id} not found.`);
      await amenity.destroy();
      res.send(`Amenity ${id} deleted.`);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };
}

export default V2AmenityController;
