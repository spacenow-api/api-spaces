import { Router, Request, Response, NextFunction } from 'express';
import sequelizeErrorMiddleware from '../helpers/middlewares/sequelize-error-middleware';
import authMiddleware from '../helpers/middlewares/auth-middleware';
import ICategory from './category.interface';
import { Category } from '../models';
 
class CategoryController {

  public path = '/categories';
  public router = Router();
  
  constructor() {
    this.intializeRoutes();
  }
 
  private intializeRoutes() {
    this.router.get(this.path, this.getRootCategories);
    this.router.get(`${this.path}/:id`, this.getCategory);
    this.router.post(this.path, authMiddleware, this.createCategory);
    this.router.patch(this.path, authMiddleware, this.createCategory);
  }
 
  private getRootCategories = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories: ICategory[] = await Category.findAll({ where: {parentId: null} });
      response.send(categories);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }

  private getCategory = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const category: ICategory = await Category.findOne({ 
        where: {id: request.params.id}, 
        include: [{ model: Category, as: 'children' }]
      });
      response.send(category);
    } catch (error) {
      console.log(error)
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }
 
  private createCategory = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body;
    try {
      const category = await Category.create(data);
      response.send(category);
    } catch (error) {
      sequelizeErrorMiddleware(error, request, response, next);
    }
  }

}
 
export default CategoryController;