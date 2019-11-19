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
    this.router.get('/external/clicks/:userId', authMiddleware, this.getClickesByUserId);
    this.router.post('/external/clicks', authMiddleware, this.saveClicksByListing);
  }

  private getClickesByUser = async (userId: string) => {
    const result: Array<ExternalClicks> | [] = await ExternalClicks.findAll({ where: { userId } });
    const totalClicks: Number = result.reduce((v, o) => v + o.clicks, 0);
    return {
      totalClicks: totalClicks,
      rows: result
    }
  }

  private getClickesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = <string>(<unknown>req.params.userId)
    try {
      const clicksByUser = await this.getClickesByUser(userId);
      res.send(clicksByUser);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  private saveClicksByListing = async (req: Request, res: Response, next: NextFunction) => {
    const { listingId } = req.body;
    try {
      const listingObj = await Listing.findOne({ where: { id: listingId } });
      if (!listingObj) throw new HttpException(400, `Listing ${listingId} not found.`);
      let externalObj = await ExternalClicks.findOne({ where: { listingId } });
      if (!externalObj) {
        await ExternalClicks.create({ listingId, userId: listingObj.userId, clicks: 1 });
        externalObj = await ExternalClicks.findOne({ where: { listingId } });
      }
      if (!externalObj) throw new HttpException(400, `Problems to manage clicks for ${listingId}.`);
      await ExternalClicks.update({ clicks: externalObj.clicks + 1 }, { where: { id: externalObj.id } });
      res.send(await this.getClickesByUser(listingObj.userId));
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }
}

export default ExternalClicksController;