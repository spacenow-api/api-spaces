import { Router, Request, Response, NextFunction } from 'express';

import authMiddleware from '../../helpers/middlewares/auth-middleware';
import sequelizeErrorMiddleware from '../../helpers/middlewares/sequelize-error-middleware';

import { ListingPhotos } from '../../models';

class ListingPhotosController {
	private router = Router();

	constructor() {
		this.intializeRoutes();
	}

	private intializeRoutes() {
		/**
		 * Get listing Photos by listing ID.
		 */
		this.router.get(
			`/listings/photos/:listingId`,
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const photosArray: Array<ListingPhotos> = await ListingPhotos.findAll(
						{
							where: { listingId: req.params.listingId },
							raw: true,
						},
					);
					res.send(photosArray);
				} catch (err) {
					sequelizeErrorMiddleware(err, req, res, next);
				}
			},
		);
	}
}

export default ListingPhotosController;
