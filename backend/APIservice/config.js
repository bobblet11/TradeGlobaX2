import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __root = `${__dirname}/../..`
dotenv.config({ path: `${__root}/config/.env` });


export const USER = process.env.DB_USER
export const PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const CLUSTER_ID = process.env.DB_CLUSTER_ID
export const TOKEN_HEADER_KEY = process.env.TOKEN_HEADER_KEY
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const PORT = process.env.PORT;
