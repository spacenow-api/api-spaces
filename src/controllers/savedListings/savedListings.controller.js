const { Router, Request, Response, NextFunction } = require('express');
const NodeCache = require('node-cache');

// const { authMiddleware } = require('../../helpers/middlewares/auth-middleware');
const sequelizeErrorMiddleware = require('../../helpers/middlewares/sequelize-error-middleware');

const { SavedListing, Listing, UserProfile } = require('../../models');

const CACHE_KEY = '_saved-listings_'

class SavedListingsController {
   path = '/saved-listing'
  router = Router()

  // Standard expiration time for 3 days...
  cache = new NodeCache({ stdTTL: 259200 })

  constructor() {
    this.router.get(`/saved-listings/:userId`, this.getSavedListingsByUser)
    this.router.post(`${this.path}`, this.createSavedListing)
    this.router.get(`${this.path}/:userId/:listingId`, this.checkSavedListingByUser)
    this.router.delete(`${this.path}/:userId/:listingId`, this.removeSavedListingByUser)
  }

  getSavedListingsByUser = async (req, res, next) => {
    const userId = (req.params.userId)
    const include = {
      where: { userId },
      include: [{ model, as: 'listing' }, { model, as: 'user' }]
    }
    // const cacheData = this.cache.get(CACHE_KEY)
    // if (cacheData) {
    //   res.send(cacheData)
    //   return
    // }
    try {
      const result = await SavedListing.findAll(include)
      // this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(result)))
      res.send(result)
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  createSavedListing = async (request, response, next) => {
    const data = request.body
    try {
      const [savedListing, _] = await SavedListing.findOrCreate({
        where: {
          listingId: data.listingId,
          userId: data.userId
        },
        defaults: {
          listingId: data.listingId,
          userId: data.userId
        }
      })
      response.send(savedListing)
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }

  checkSavedListingByUser = async (request, response, next) => {
    const listingId = (request.params.listingId)
    const userId = (request.params.userId)
    try {
      this.cache.flushAll()
      const savedListingObj = await SavedListing.findOne({
        where: {
          userId,
          listingId
        }
      })
      response.send(savedListingObj)
    } catch (error) {
      console.error(error)
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }

  removeSavedListingByUser = async (request, response, next) => {
    const listingId = (request.params.listingId)
    const userId = (request.params.userId)
    try {
      this.cache.flushAll()
      let savedListingObj = await SavedListing.findOne({
        where: {
          userId,
          listingId
        }
      })
      let removed
      if (savedListingObj) {
        removed = await savedListingObj.destroy()
      }
      response.send(removed)
    } catch (error) {
      console.error(error)
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }
}

export default SavedListingsController
