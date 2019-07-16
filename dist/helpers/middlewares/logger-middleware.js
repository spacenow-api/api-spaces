"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (request, response, next) => {
    console.debug(`${request.method} ${request.path}`);
    next();
};
