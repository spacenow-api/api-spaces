const { Router } = require("express");

const { authMiddleware } = require('../../helpers/middlewares/auth-middleware');
const HttpException = require("../../helpers/exceptions/HttpException");
const sequelizeErrorMiddleware = require("../../helpers/middlewares/sequelize-error-middleware");

const { Reviews, Bookings } = require("../../models");

class ListingReviewsController {

  router = Router();

  constructor() {
    this.router.get('/listing/:listingId/reviews', this.getReviewsByListing);
    this.router.get('/listing/:listingId/reviews/private', authMiddleware, this.getPrivateReviewsByListing);
    this.router.post('/listing/:bookingId/reviews', authMiddleware, this.createReviewByListing);
  }

  paginate(query, { page, pageSize }) {
    if (pageSize <= 0)
      return { ...query }
    const offset = --page * pageSize;
    const limit = offset + pageSize;
    return {
      ...query,
      offset,
      limit,
    };
  };

  /**
   * Getting public reviews for any Space.
   */
  getReviewsByListing = async (req, res, next) => {
    const listingId = parseInt(req.params.listingId, 10);
    const page = parseInt(req.query.page, 10) | 0;
    const pageSize = parseInt(req.query.pageSize, 10) | 0;
    const whereCondition = { where: { listId: listingId, isAdmin: 0 } };
    try {
      const totalReviews = await Reviews.count(whereCondition)
      const reviewsResult = await Reviews.findAll(this.paginate({
        ...whereCondition,
        order: [["createdAt", "DESC"]]
      }, { page, pageSize }));
      let totalPages = 0;
      if (pageSize > 0)
        totalPages = Math.ceil(totalReviews / pageSize)
      res.send({ totalPages, result: reviewsResult });
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  createReviewByListing = async (req, res, next) => {
    const userId = req.userIdDecoded;
    if (!userId) {
      throw new HttpException(400, 'Authentication token missing exception!');
    }
    const bookingId = req.params.bookingId;
    const data = req.body;
    try {
      const bookingObj = await Bookings.findOne({ where: { bookingId } });
      if (!bookingObj) {
        throw new HttpException(400, `Booking ${bookingId} not found.`);
      }
      if (data.isAdmin) {
        if (userId !== bookingObj.hostId) {
          throw new HttpException(400, `You may only provide Private Reviews for the Spaces you own.`);
        }
      } else {
        if (userId !== bookingObj.guestId) {
          throw new HttpException(400, `You can only provide Reviews for the Spaces you have been to.`);
        }
        const reviewsExisting = await Reviews.findAll({ where: { reservationId: bookingId, authorId: userId }, limit: 1 })
        if (reviewsExisting && reviewsExisting.length > 0) {
          throw new HttpException(400, `FEEDBACK_EXISTING`);
        }
      }
      const reviewData = {
        reservationId: bookingObj.bookingId,
        listId: bookingObj.listingId,
        authorId: userId,
        userId: bookingObj.hostId,
        reviewContent: data.publicComment,
        privateFeedback: data.privateComment,
        ratingOverall: data.ratingOverall,
        ratingCheckIn: data.ratingCheckIn,
        ratingHost: data.ratingHost,
        ratingValue: data.ratingValue,
        ratingCleanliness: data.ratingCleanliness,
        ratingLocation: data.ratingLocation,
        isAdmin: data.isAdmin
      };
      await Reviews.create(reviewData);
      res.send(await Reviews.findAll({ where: { listId: bookingObj.listingId }, order: [["createdAt", "DESC"]] }));
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

  /**
   * Only for Host. Must be authenticated.
   */
  getPrivateReviewsByListing = async (req, res, next) => {
    const userId = req.userIdDecoded;
    if (!userId)
      throw new HttpException(400, 'Authentication token missing exception!');
    const listingId = req.params.listingId;
    try {
      res.send(await Reviews.findAll({ where: { listId: listingId, userId: userId }, order: [["createdAt", "DESC"]] }));
    } catch (err) {
      console.error(err)
      sequelizeErrorMiddleware(err, req, res, next)
    }
  }

}

export default ListingReviewsController;
