import * as dotenv from 'dotenv';
dotenv.config();

export const DEBUG = process.env.DEBUG ? Boolean(process.env.DEBUG) : false;

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 6002;

// Database Parameters
export const dbSchema = process.env.DATABASE_SCHEMA;
export const dbUsername = process.env.DATABASE_USERNAME;
export const dbPassword = process.env.DATABASE_PASSWORD;
export const dbEndpoint = process.env.DATABASE_ENDPOINT;
