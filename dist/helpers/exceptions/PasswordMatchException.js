"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
class PasswordMatchException extends HttpException_1.default {
    constructor() {
        super(400, `Password does not match`);
    }
}
exports.default = PasswordMatchException;
