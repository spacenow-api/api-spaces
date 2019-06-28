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
class RolesController {
    constructor() {
        this.path = '/roles';
        this.router = express_1.Router();
        this.getAllRoles = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield models_1.Role.findAll();
                response.send(roles);
            }
            catch (error) {
                sequelize_error_middleware_1.default(error, request, response, next);
            }
        });
        this.getRole = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield models_1.Role.findOne({ where: { id: request.params.id } });
                response.send(role);
            }
            catch (error) {
                sequelize_error_middleware_1.default(error, request, response, next);
            }
        });
        this.createRole = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            try {
                const role = yield models_1.Role.create(data);
                response.send(role);
            }
            catch (error) {
                sequelize_error_middleware_1.default(error, request, response, next);
            }
        });
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllRoles);
        this.router.get(`${this.path}/:id`, this.getRole);
        this.router.post(this.path, this.createRole);
        this.router.patch(this.path, this.createRole);
    }
}
exports.default = RolesController;
