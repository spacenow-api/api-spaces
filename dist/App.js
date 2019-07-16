"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const sequelize_1 = __importDefault(require("./helpers/database/sequelize"));
const logger_middleware_1 = __importDefault(require("./helpers/middlewares/logger-middleware"));
const error_middleware_1 = __importDefault(require("./helpers/middlewares/error-middleware"));
const sequelize_middleware_1 = __importDefault(require("./helpers/middlewares/sequelize-middleware"));
class App {
    constructor(controllers, port, host) {
        this.app = express_1.default();
        this.port = port;
        this.host = host;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.initializeDatabase();
    }
    initializeMiddlewares() {
        this.app.use(logger_middleware_1.default);
        this.app.use(sequelize_middleware_1.default);
        this.app.use(body_parser_1.default.json());
        this.app.use(cookie_parser_1.default());
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    initializeDatabase() {
        sequelize_1.default.initialize();
    }
    initializeControllers(controllers) {
        controllers.forEach((c) => this.app.use('/', c.router));
    }
    listen() {
        this.app.listen(this.port, this.host, () => {
            console.log(`API * Spaces * listening on ${this.host}:${this.port}`);
        });
    }
}
exports.default = App;
