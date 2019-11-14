import { Router, Request, Response, NextFunction } from 'express'

import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware'

import { ListingPhotos } from '../../models'
import { Op } from 'sequelize'

class ListingPhotosController {
  private router = Router()

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    /**
     * Get listing Photos by listing ID.
     */
    this.router.get('/listings/photos/:listingId', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const photosArray: Array<ListingPhotos> = await ListingPhotos.findAll({
          where: {
            listingId: req.params.listingId,
            type: { [Op.like]: 'image/%' }
          }
        })
        res.send(photosArray)
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next)
      }
    })

    /**
     * Get an unique Video by a Listing.
     */
    this.router.get('/listings/video/:listingId', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const videoObj: ListingPhotos | null = await ListingPhotos.findOne({
          where: { listingId: req.params.listingId, type: 'video/mp4' },
          limit: 1
        })
        res.send(videoObj)
      } catch (err) {
        sequelizeErrorMiddleware(err, req, res, next)
      }
    })
  }
}

export default ListingPhotosController
