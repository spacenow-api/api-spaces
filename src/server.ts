import { PORT } from './config';

import App from './App';

import ListingController from './controllers/listing.controller';
import ListSettingsController from './controllers/listSettings.controller';
import ListingAmenities from './controllers/listingAmenities.controller';
import ListingRulesController from './controllers/listingRules.controller';

const app = new App(
  [
    new ListingController(),
    new ListSettingsController(),
    new ListingAmenities(),
    new ListingRulesController()
  ],
  PORT,
  '0.0.0.0'
);

app.listen();
