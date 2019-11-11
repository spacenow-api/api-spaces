import { Router, Request, Response, NextFunction } from 'express';

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
		this.router.get('/listings/photos/:listingId', async (req: Request, res: Response, next: NextFunction) => {
			try {
				const photosArray: Array<ListingPhotos> = await ListingPhotos.findAll({
					where: { listingId: req.params.listingId, type: 'image/jpeg' }
				});
				res.send(photosArray);
			} catch (err) {
				sequelizeErrorMiddleware(err, req, res, next);
			}
		});
	}
}

export default ListingPhotosController;
