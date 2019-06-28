import { PORT } from './config';

import App from './App';

import ListingController from './controllers/listing.controller';
import ListSettingsController from './controllers/listSettings.controller';

const app = new App(
  [new ListingController(), new ListSettingsController()],
  PORT,
  '0.0.0.0'
);

app.listen();
