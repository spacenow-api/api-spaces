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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../../helpers/exceptions/UserWithThatEmailAlreadyExistsException"));
const WrongCredentialsException_1 = __importDefault(require("../../helpers/exceptions/WrongCredentialsException"));
const PasswordMatchException_1 = __importDefault(require("../../helpers/exceptions/PasswordMatchException"));
const token_controller_1 = __importDefault(require("../token/token.controller"));
const models_1 = require("../../models");
class AuthenticationController {
    constructor() {
        this.path = "/auth";
        this.router = express_1.Router();
        this.register = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            const user = yield models_1.User.findOne({
                where: { email: userData.email }
            });
            if (user)
                next(new UserWithThatEmailAlreadyExistsException_1.default(userData.email));
            else {
                yield models_1.User.create(userData);
                const tokenData = new token_controller_1.default().createToken(userData);
                response.send(tokenData);
            }
        });
        this.signin = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const logInData = request.body;
            const user = yield models_1.User.findOne({
                where: { email: logInData.email }
            });
            if (user) {
                const isPasswordMatching = yield bcryptjs_1.default.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    const tokenData = new token_controller_1.default().createToken(user);
                    response.send(tokenData);
                }
                else
                    next(new PasswordMatchException_1.default());
            }
            else
                next(new WrongCredentialsException_1.default());
        });
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/signin`, this.signin);
    }
}
exports.default = AuthenticationController;
