import { Router, Request, Response, NextFunction } from "express";

import { authMiddleware } from "../../../helpers/middlewares/auth-middleware";
import sequelizeErrorMiddleware from "../../../helpers/middlewares/sequelize-error-middleware";

import { V2Amenity } from "../../../models/v2";

class V2AmenityController {
  private router = Router();

  constructor() {
    this.router.get(`/v2/amenities`, this.getAmenities);
    this.router.get(`/v2/amenity/:id`, this.getAmenity);
    this.router.post(`/v2/amenity`, authMiddleware, this.postAmenity);
    this.router.put(`/v2/amenity/:id`, authMiddleware, this.putAmenity);
    this.router.delete(`/v2/amenity/:id`, authMiddleware, this.deleteAmenity);
  }

  getAmenities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await V2Amenity.findAll());
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  getAmenity = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      res.send(await V2Amenity.findByPk(id));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  postAmenity = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      res.send(await V2Amenity.create(data));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  putAmenity = async (req: Request, res: Response, next: NextFunction) => {
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

  deleteAmenity = async (req: Request, res: Response, next: NextFunction) => {
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
