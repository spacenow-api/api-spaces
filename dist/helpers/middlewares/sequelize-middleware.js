"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
exports.default = (request, response, next) => {
    models_1.sequelize.sync();
    next();
};
