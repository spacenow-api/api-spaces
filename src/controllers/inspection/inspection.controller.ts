import { Router, Request, Response, NextFunction } from 'express'
import NodeCache from 'node-cache'

// import { authMiddleware } from '../../helpers/middlewares/auth-middleware'
import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware'
import HttpException from '../../helpers/exceptions/HttpException'

import { Inspection } from '../../models'

class InspectionController {
  public path = '/inspection'
  private router = Router()

  // Standard expiration time for 3 days...
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 })

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    this.router.get(`${this.path}`, this.getInspections)
    this.router.post(`${this.path}/create`, this.createInspection)
    this.router.put(`${this.path}/update`, this.updateInspection)
  }

  private getInspections = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const inspectionsArray: Array<Inspection> = await Inspection.findAll()
      response.send(inspectionsArray)
    } catch (error) {
      console.error(error)
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }

  private createInspection = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body
    console.log('post function', data)
    try {
      const inspection: any = await Inspection.create({
        listingId: data.listingId,
        messageId: data.messageId,
        guestId: data.guestId,
        date: data.date,
        time: data.time
      })
      response.send(inspection)
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }

  private updateInspection = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body
    try {
      this.cache.flushAll()
      const inspectionObj: Inspection | null = await Inspection.findOne({
        where: { id: data.id }
      })
      if (!inspectionObj) throw new HttpException(400, `Inspection ${data.id} not found.`)
      await Inspection.update(
        {
          status: data.status
        },
        { where: { id: data.id } }
      )
      response.send(inspectionObj)
    } catch (error) {
      console.error(error)
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }
}

export default InspectionController
