import express from 'express';
import bodyParser from 'body-parser';
import * as manager from './manager.js'; // Ensure to add .js extension
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import rateLimit from 'express-rate-limit';


//custom middleware
import { authenticate } from './middlewares/authenticate.js';
import {errorHandler} from './middlewares/errorHandler.js'
import { validate } from './middlewares/validate.js';
import { sanitise } from './middlewares/sanitize.js';
import { cacheCheck, updateCache } from './middlewares/cache.js';


//validation schemas
import {
	COIN_META_DATA_GET_SCHEMA,
	COIN_ALL_GET_SCHEMA,
	COIN_PRICE_INSTANCE_GET_SCHEMA,
	COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA,
	COIN_META_DATA_SCHEMA,
	COIN_GET_SPECIFIC_SCHEMA,
	COIN_PRICE_INSTANCE_SCHEMA
} from './constants/schemas.js'; 

const app = express();
const port = process.env.PORT || 3000;


// Database connection
export let db;
const connectToDatabase = async () => {
    try {
        db = await manager.connectDB();
        app.locals.db = db; // Store the db in app.locals
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start the server due to database connection error:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
};
connectToDatabase();


const corsOptions = {
	origin: `${process.env.SITE_ORIGIN} ${process.env.FETCHER_ORIGIN}`,// Allow only this origin
	methods: 'GET,PUT,POST', // Allowed HTTP methods
	preflightContinue: false, // Pass the CORS preflight response to the next handler
	optionsSuccessStatus: 204, // Respond with 204 for successful OPTIONS requests
	allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));


// built in middlewares
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));
//logging middleware
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url} ${req.query} ${req.body}`);
	next(); 
});
app.use(errorHandler)


app.post('/*', authenticate());
app.put('/*', authenticate());
app.get('/*', async (req,res, next) => {
	const now = new Date();
    	const expires = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
	res.set('Expires', expires.toUTCString());
	res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
	next();
})

//Routes
app.get('/coin/metadata', validate(COIN_META_DATA_GET_SCHEMA), async (req, res, next) => {
	const {symbol} = req.query
	try{
		const coinMetadata = await manager.getCoinMetadata(db, symbol)
		res.status(200).send(coinMetadata)
	}catch (error){
		next(error);
	}
});


app.post('/coin/metadata', validate(COIN_META_DATA_SCHEMA), sanitise(), async (req, res, next) => {
	try {
		await manager.insertCoin(db, req.body)
		return res.status(201).send("successfully inserted coin");
		
	} catch (error) {
		next(error);
	}
});

app.put('/coin/metadata', validate(COIN_META_DATA_SCHEMA),sanitise(), async (req, res, next) => {
	try {
		await manager.updateCoin(db, req.body)
		return res.status(201).send("successfully updated coin");
	} catch (error) {
		next(error);
	}
});


app.post('/coin/priceInstance', validate(COIN_PRICE_INSTANCE_SCHEMA), sanitise(), async (req, res, next) => {
	try {
		await manager.insertPriceInstance(db, req.body)
		return res.status(201).send("successfully inserted priceInstance")
	} catch (error) {
		next(error);
	}
});


app.get('/coin/priceInstance', validate(COIN_PRICE_INSTANCE_GET_SCHEMA), async (req, res, next) => {
	const {symbol, numberOfInstances} = req.query
	try{
		const priceInstance = await manager.getPriceInstance(db, symbol, numberOfInstances)
		res.status(200).send(priceInstance)
	}catch (error){
		next(error);
	}
});


app.get('/coin/priceInstance/range', validate(COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA), sanitise(), async (req, res, next) => {	
	const { symbol, startDate, endDate} = req.query;
	try{
		const priceInstances = await manager.getPriceInstanceRange(db, symbol, startDate, endDate)
		res.status(200).send(priceInstances)
	}catch (error){
		next(error);
	}
});


app.get('/coin/all', validate(COIN_ALL_GET_SCHEMA), cacheCheck(), async (req, res, next) => {
	try{
		const coins = await manager.getAllCoinsWithLatestPriceInstance(db, req.query)
		res.status(200).send(coins)
		updateCache(req, coins)
	}catch (error){
		next(error);
	}
});


app.get('/coin', validate(COIN_GET_SPECIFIC_SCHEMA), sanitise(), async (req, res, next) => {
	const { symbol} = req.query;
	try{
		const coin = await manager.getSpecificCoin(db, symbol)
		console.log(coin)
		res.status(200).send(coin)
	}catch (error){
		next(error);
	}
});