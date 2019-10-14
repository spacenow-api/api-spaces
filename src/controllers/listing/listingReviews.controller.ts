import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from '../../helpers/middlewares/auth-middleware';
import HttpException from "../../helpers/exceptions/HttpException";
import sequelizeErrorMiddleware from "../../helpers/middlewares/sequelize-error-middleware";

import { Reviews, Bookings } from "../../models";

class ListingReviewsController {

  private router = Router();

  constructor() {
    this.router.get('/listing/:listingId/reviews', this.getReviewsByListing);
    this.router.get('/listing/:listingId/reviews/private', authMiddleware, this.getPrivateReviewsByListing);
    this.router.post('/listing/:bookingId/reviews', authMiddleware, this.createReviewByListing);
  }

  /**
   * Getting public reviews for any Space.
   */
  private getReviewsByListing = async (req: Request, res: Response, next: NextFunction) => {
    const listingId = parseInt(req.params.listingId, 10);
    try {
      const reviews = await Reviews.findAll({ where: { listId: listingId } });
      res.send({ count: reviews.length, data: reviews });
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  private createReviewByListing = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userIdDecoded;
    const bookingId = req.params.bookingId;
    const data = req.body;
    try {
      const bookingObj: Bookings | null = await Bookings.findOne({ where: { bookingId } });
      if (!bookingObj)
        throw new HttpException(400, `Booking ${bookingId} not found.`);
      const reviewData = {
        reservationId: bookingObj.bookingId,
        listId: bookingObj.listingId,
        authorId: userId,
        userId: bookingObj.hostId,
        reviewContent: data.publicComment,
        rating: data.rating,
        privateFeedback: data.privateComment
      };
      await Reviews.create(reviewData);
      const reviews = await Reviews.findAll({ where: { listId: bookingObj.listingId } });
      res.send({ count: reviews.length, data: reviews });
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  /**
   * Only for Host. Must be authenticated.
   */
  private getPrivateReviewsByListing = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userIdDecoded;
    const listingId = req.params.listingId;
    if (!userId)
      throw new HttpException(400, 'Authentication token missing exception!');
    try {
      const reviews = await Reviews.findAll({ where: { listId: listingId, userId: userId } });
      res.send({ count: reviews.length, data: reviews });
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

}

export default ListingReviewsController;
