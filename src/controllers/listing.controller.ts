import { Router, Request, Response, NextFunction } from 'express';

import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';
import authMiddleware from '../helpers/middlewares/auth-middleware';
import ICategory from './listing.interface';
import { Listing } from '../models';

const PATH = '/listings';

class ListingController {
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {}
}

export default ListingController;
