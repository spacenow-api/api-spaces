import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from '../../helpers/middlewares/auth-middleware';
import HttpException from "../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Reviews } from "../../models";

class ListingReviewsController {

  private router = Router();

  constructor() {
    this.router.get('/listing/:listingId/reviews', this.getReviewsByListing);
    this.router.post('/listing/:listingId/reviews', authMiddleware, this.createReviewByListing);
    this.router.get('/listing/:listingId/reviews/private', authMiddleware, this.getPrivateReviewsByListing);
  }

  /**
   * Getting public reviews for any Space.
   */
  private getReviewsByListing = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.listingId;
    try {
      res.end();
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  private createReviewByListing = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.listingId;
    const data = req.body;
    try {
      res.end();
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  /**
   * Only for Host. Must be authenticated.
   */
  private getPrivateReviewsByListing = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.listingId;
    try {
      res.end();
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

}

export default ListingReviewsController;
