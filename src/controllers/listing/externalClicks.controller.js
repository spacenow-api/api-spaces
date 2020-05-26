const { Router } = require('express');

const HttpException = require('../../helpers/exceptions/HttpException');

const sequelizeErrorMiddleware = require('../../helpers/middlewares/sequelize-error-middleware');

const { ExternalClicks, Listing } = require('../../models');

class ExternalClicksController {

  router = Router()

  constructor() {
    this.router.get('/external/clicks/:userId', this.getClickesByUserId);
    this.router.post('/external/clicks', this.saveClicksByListing);
  }

  getClickesByUser = async (userId) => {
    const result = await ExternalClicks.findAll({ where: { userId } });
    const totalClicks = result.reduce((v, o) => v + o.clicks, 0);
    return {
      totalClicks: totalClicks,
      rows: result
    }
  }

  getClickesByUserId = async (req, res, next) => {
    const userId = (req.params.userId)
    try {
      const clicksByUser = await this.getClickesByUser(userId);
      res.send(clicksByUser);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  }

  saveClicksByListing = async (req, res, next) => {
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