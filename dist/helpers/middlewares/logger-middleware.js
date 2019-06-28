"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (request, response, next) => {
    console.log(`${request.method} ${request.path}`);
    next();
};
