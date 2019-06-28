"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HealthException_1 = __importDefault(require("../../helpers/exceptions/HealthException"));
class HealthController {
    constructor() {
        this.path = "/health";
        this.router = express_1.Router();
        this.health = (request, response, next) => {
            response.send(new HealthException_1.default());
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.health);
    }
}
exports.default = HealthController;
