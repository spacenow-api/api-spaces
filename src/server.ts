import { PORT } from './config';

import App from './App';

import CategoriesController from './categories/category.controller';

const app = new App([new CategoriesController()], PORT, '0.0.0.0');

app.listen();
