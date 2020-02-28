import { Router, Request, Response, NextFunction } from 'express'
import NodeCache from 'node-cache'

// import { authMiddleware } from '../../helpers/middlewares/auth-middleware'
import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware'

import { SavedListing, Listing, User } from '../../models'

const CACHE_KEY = '_saved-listings_'

class SavedListingsController {
  public path = '/saved-listing'
  private router = Router()

  // Standard expiration time for 3 days...
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 })

  constructor() {
    this.router.get(`/saved-listings/:userId`, this.getSavedListingsByUser)
    this.router.post(`${this.path}`, this.createSavedListing)
    this.router.get(`${this.path}/:userId/:listingId`, this.checkSavedListingByUser)
    this.router.delete(`${this.path}/:userId/:listingId`, this.removeSavedListingByUser)
  }

  getSavedListingsByUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = <string>(<unknown>req.params.userId)
    const include = {
      where: { userId },
      include: [{ model: Listing, as: 'listing' }, { model: User, as: 'user' }]
    }
    const cacheData = this.cache.get(CACHE_KEY)
    if (cacheData) {
      res.send(cacheData)
      return
    }
    try {
      const result = await SavedListing.findAll(include)
      this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(result)))
      res.send(result)
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  private createSavedListing = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body
    try {
      const [savedListing, _]: any = await SavedListing.findOrCreate({
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

  private checkSavedListingByUser = async (request: Request, response: Response, next: NextFunction) => {
    const listingId = <number>(<unknown>request.params.listingId)
    const userId = <string>(<unknown>request.params.userId)
    try {
      this.cache.flushAll()
      const savedListingObj: SavedListing | null = await SavedListing.findOne({
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

  private removeSavedListingByUser = async (request: Request, response: Response, next: NextFunction) => {
    const listingId = <number>(<unknown>request.params.listingId)
    const userId = <string>(<unknown>request.params.userId)
    try {
      this.cache.flushAll()
      let savedListingObj: SavedListing | null = await SavedListing.findOne({
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
