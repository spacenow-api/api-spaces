"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const App_1 = __importDefault(require("./App"));
const user_controller_1 = __importDefault(require("./controllers/users/user.controller"));
const authentication_controller_1 = __importDefault(require("./controllers/authentication/authentication.controller"));
const app = new App_1.default([new user_controller_1.default(), new authentication_controller_1.default()], config_1.PORT, '0.0.0.0');
app.listen();
