import App from './App';
import CategoriesController from './categories/category.controller';
 
const app = new App(
  [
    new CategoriesController(),
  ],
  3003,
  '0.0.0.0'
);
 
app.listen();