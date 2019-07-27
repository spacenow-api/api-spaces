import { PORT } from './config';

import App from './App';

import HealthController from './controllers/health/health.controller';
import ListingController from './controllers/listing/listing.controller';
import ListingSettingsController from './controllers/listing/listingSettings.controller';
import ListingAmenities from './controllers/listing/listingAmenities.controller';
import ListingRulesController from './controllers/listing/listingRules.controller';
import ListingAccessDaysController from './controllers/listing/listingAccessDays.controller';
import ListingPhotosController from './controllers/listing/listingPhotos.controller';

const app = new App(
	[
		new HealthController(),
		new ListingController(),
		new ListingSettingsController(),
		new ListingAmenities(),
		new ListingRulesController(),
		new ListingAccessDaysController(),
		new ListingPhotosController(),
	],
	PORT,
	'0.0.0.0',
);

app.listen();
