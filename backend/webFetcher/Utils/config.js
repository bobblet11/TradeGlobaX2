import dotenv from 'dotenv';
import { readLineFromFile } from './fileUtils.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __root = `${__dirname}/../../..`
dotenv.config({ path: `${__root}/config/.env` });

//Request retry logic constants
export const RETRY_LIMIT = 3;
export const RETRY_DELAY = 1000;

//Total number of connections at any given time
export const CONN_BATCH_SIZE = 100;

//Path to list of coins ids to track
export const COINS_PATH = `${__dirname}/${process.env.COINS_PATH}`;
export const COIN_IDS_TO_TRACK = readLineFromFile(COINS_PATH, 1);

export const ROOT_URL = process.env.ROOT_URL
export const DB_API_PORT = process.env.PORT;

//API keys for the coin market data, an access to the database
export const MARKET_CAP_API_KEY = process.env.CMC_API_KEY;
export const DB_API_KEY = process.env.DB_API_KEY;
