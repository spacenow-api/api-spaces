import express, { Application } from 'express';
import loggerMiddleware from './helpers/middlewares/logger-middleware';
import cookieParse from 'cookie-parser';
import bodyParser from 'body-parser';
import errorMiddleware from './helpers/middlewares/error-middleware';
import sequelizeMiddleware from './helpers/middlewares/sequelize-middleware';

class App {

  public app:Application;
  public port:number;
  public host:string;

  constructor(controllers: any, port: number, host: string) {
    this.app = express();
    this.port = port;
    this.host = host;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares():void {
    this.app.use(loggerMiddleware);
    this.app.use(sequelizeMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParse());
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: any):void {
    controllers.forEach((controller:any) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, this.host, () => {
      console.log(`App listening on the port ${this.host}:${this.port}`);
    });
  }

}

export default App;