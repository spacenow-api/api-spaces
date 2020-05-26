const express, { Application } = require('express');
const compression = require('compression');
const cookieParse = require('cookie-parser');
const bodyParser = require('body-parser');

const sequelize = require('./helpers/database/sequelize');
const loggerMiddleware = require('./helpers/middlewares/logger-middleware');
const errorMiddleware = require('./helpers/middlewares/error-middleware');
const sequelizeMiddleware = require('./helpers/middlewares/sequelize-middleware');

class App {
   app
   port
   host

  constructor(controllers, port, host) {
    this.app = express();
    this.port = port;
    this.host = host;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  initializeMiddlewares() {
    this.app.use(loggerMiddleware);
    this.app.use(sequelizeMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParse());
    this.app.use(compression());
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  initializeDatabase() {
    sequelize.initialize();
  }

  initializeControllers(controllers) {
    controllers.forEach((c) => this.app.use('/', c.router));
  }

   listen() {
    this.app.listen(this.port, this.host, () => {
      console.info(`API * Spaces * listening on ${this.host}:${this.port}`);
    });
  }
}

export default App;
