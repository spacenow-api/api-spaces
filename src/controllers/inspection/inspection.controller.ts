import { Router, Request, Response, NextFunction } from 'express'
import NodeCache from 'node-cache'

// import { authMiddleware } from '../../helpers/middlewares/auth-middleware'
import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware'
import HttpException from '../../helpers/exceptions/HttpException'

import { Inspection, Message, MessageItem } from '../../models'

const CACHE_KEY = "_inspections_";

class InspectionController {
  public path = '/inspection'
  private router = Router()

  // Standard expiration time for 3 days...
  private cache: NodeCache = new NodeCache({ stdTTL: 259200 })

  constructor() {
    this.router.get(`/inspections`, this.getInspections)
    this.router.post(`${this.path}`, this.createInspection)
    this.router.put(`${this.path}`, this.updateInspection)
  }

  getInspections = async (req: Request, res: Response, next: NextFunction) => {
    const include = {
      include: [
        { 
          model: Message, 
          as: "message",
          include: [
            { 
              model: MessageItem, 
              as: "messages",
            },
          ]
        },
      ]
    };
    // const cacheData = this.cache.get(CACHE_KEY);
    // if (cacheData) {
    //   res.send(cacheData);
    //   return;
    // }
    try {
      const result = await Inspection.findAll(include);
      // this.cache.set(CACHE_KEY, JSON.parse(JSON.stringify(result)));
      res.send(result);
    } catch (err) {
      console.error(err);
      sequelizeErrorMiddleware(err, req, res, next);
    }
  };

  private createInspection = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body
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
        where: { messageId: data.id }
      })
      if (!inspectionObj) throw new HttpException(400, `Inspection with messageId ${data.id} not found.`)
      const newInspectionObj = await Inspection.update(
        {
          status: data.status
        },
        { where: { messageId: data.id } }
      )
      response.send(newInspectionObj)
    } catch (error) {
      console.error(error)
      sequelizeErrorMiddleware(error, request, response, next)
    }
  }
}

export default InspectionController
