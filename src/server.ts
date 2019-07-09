import { PORT } from './config';

import App from './App';

import ListingController from './controllers/listing.controller';
import ListingSettingsController from './controllers/listingSettings.controller';
import ListingAmenities from './controllers/listingAmenities.controller';
import ListingRulesController from './controllers/listingRules.controller';
import ListingAccessDaysController from './controllers/listingAccessDays.controller';

const app = new App(
  [
    new ListingController(),
    new ListingSettingsController(),
    new ListingAmenities(),
    new ListingRulesController(),
    new ListingAccessDaysController()
  ],
  PORT,
  '0.0.0.0'
);

app.listen();
