import { Router, Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import axios from 'axios'
import Sequelize, { Op } from 'sequelize'

import authMiddleware from '../../helpers/middlewares/auth-middleware'
import HttpException from '../../helpers/exceptions/HttpException'

import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware'

import { ExternalClicks, Listing, UserProfile, Location } from '../../models'

import * as config from '../../config'

class ExternalClicksController {

  private router = Router()

  constructor() {
    this.router.get('/external/clicks/:userId', this.getClickesByUserId);
    this.router.post('/external/clicks', this.saveClicksByListing);
  }

  private getClickesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = <number>(<unknown>req.params.userId)
    try {
      // Fetch clicks...
      const result: Array<ExternalClicks> | [] = await ExternalClicks.findAll({ where: { userId } });
      const totalClicks: Number = result.reduce((v, o) => v + o.clicks, 0);
      res.send({
        totalClicks: totalClicks,
        rows: result
      });
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private saveClicksByListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }
}

export default ExternalClicksController;