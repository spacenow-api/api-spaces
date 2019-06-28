"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const config = __importStar(require("../config"));
const role_model_1 = require("./role.model");
const user_model_1 = require("./user.model");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    host: config.dbEndpoint,
    database: config.dbSchema,
    dialect: 'mysql',
    username: config.dbUsername,
    password: config.dbPassword,
    logging: false,
    storage: ':memory:'
});
exports.sequelize.addModels([
    role_model_1.Role,
    user_model_1.User
]);
var role_model_2 = require("./role.model");
exports.Role = role_model_2.Role;
var user_model_2 = require("./user.model");
exports.User = user_model_2.User;
