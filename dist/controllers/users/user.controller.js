"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_error_middleware_1 = __importDefault(require("../../helpers/middlewares/sequelize-error-middleware"));
const models_1 = require("../../models");
const auth_middleware_1 = __importDefault(require("../../helpers/middlewares/auth-middleware"));
class UsersController {
    constructor() {
        this.path = '/users';
        this.router = express_1.Router();
        this.getAllUsers = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.User.findAll();
                response.send(users);
            }
            catch (error) {
                sequelize_error_middleware_1.default(error, request, response, next);
            }
        });
        this.getUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOne({ where: { id: request.params.id } });
                response.send(user);
            }
            catch (error) {
                sequelize_error_middleware_1.default(error, request, response, next);
            }
        });
        this.createUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            try {
                const user = yield models_1.User.create(data);
                response.send(user);
            }
            catch (error) {
                sequelize_error_middleware_1.default(error, request, response, next);
            }
        });
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, auth_middleware_1.default, this.getAllUsers);
        this.router.get(`${this.path}/:id`, this.getUser);
        this.router.post(this.path, this.createUser);
        this.router.patch(this.path, this.createUser);
    }
}
exports.default = UsersController;
