"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (request, response, next) => {
    console.debug('Running Database middleware.');
    // todo: Looking for an approach to turn Sync database dynamicaly, to 'NOT' sync in production. [Arthemus]
    // sequelize.sync();
    next();
};
