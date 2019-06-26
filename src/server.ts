import { PORT } from './config';

import App from './App';

import ListingController from './controllers/listing.controller';

const app = new App([new ListingController()], PORT, '0.0.0.0');

app.listen();
