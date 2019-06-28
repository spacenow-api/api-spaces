"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenController {
    createToken(user) {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET || 'Spacenow';
        const dataStoredInToken = {
            id: user.id,
        };
        return {
            expiresIn,
            token: jsonwebtoken_1.default.sign(dataStoredInToken, secret, { expiresIn })
        };
    }
    getToken(request) {
        if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
            return request.headers.authorization.split(' ')[1];
        }
        else if (request.query && request.query.token) {
            return request.query.token;
        }
        else if (request.cookies && request.cookies.authorization) {
            return request.cookies.authorization;
        }
        return '';
    }
}
exports.default = TokenController;
