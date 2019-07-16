"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
exports.default = ({ errors }, req, res, next) => {
    if (errors && errors.length > 0) {
        const message = errors.map((error) => error.message)[0];
        next(new HttpException_1.default(400, message));
    }
    else {
        next(new HttpException_1.default(500, ''));
    }
};
