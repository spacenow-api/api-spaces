"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 6001;
// Database Parameters
exports.dbSchema = process.env.DATABASE_SCHEMA || 'spacenow-api-users';
exports.dbUsername = process.env.DATABASE_USERNAME || 'spacenowtest';
exports.dbPassword = process.env.DATABASE_PASSWORD || 'Spac.918273!';
exports.dbEndpoint = process.env.DATABASE_ENDPOINT ||
    'spacenow-test.cjo4zy3wnflc.ap-southeast-2.rds.amazonaws.com';
