import express from 'express';
import bodyParser from 'body-parser';
import * as manager from './manager.js'; // Ensure to add .js extension
import Joi from 'joi';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
	origin: '*', // Accept requests from all origins
};

// Enable CORS with options
app.use(cors(corsOptions));

const COIN_META_DATA_GET_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required()
});

const COIN_ALL_GET_SCHEMA = Joi.object({
	startCoin: Joi.number()
	    .optional(),
	endCoin: Joi.number()
	    .optional()
});

const COIN_PRICE_INSTANCE_GET_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required(),
	numberOfInstances: Joi.number()
	    .greater(0)
});

const COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required(),
	startDate: Joi.date()
	    .required(),
	endDate: Joi.date()
	    .required(),
});

const COIN_META_DATA_SCHEMA = Joi.object({
	name: Joi.string()
	    .min(1)
	    .required(),
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required(),
	description: Joi.string()
	    .required(),
	logo: Joi.string()
	    .uri()
	    .required()
});

const COIN_GET_SPECIFIC_SCHEMA = Joi.object({
symbol: Joi.string()
	.uppercase()
	.min(1)
	.required()
})
    
const COIN_PRICE_INSTANCE_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .required(),
	timestamp: Joi.date()
	    .required(),
	price: Joi.number()
	    .greater(0)
	    .required(),
	market_cap: Joi.number()
	    .greater(0)
	    .required(),
	volume_change_24h: Joi.number()
	    .required(),
	circulating_supply: Joi.number()
	    .greater(0)
	    .required(),
	total_supply: Joi.number()
	    .greater(0)
	    .required(),
	fully_diluted_market_cap: Joi.number()
	    .greater(0)
	    .required(),
	percent_change_1h: Joi.number()
	    .required(),
	percent_change_24h: Joi.number()
	    .required(),
	percent_change_7d: Joi.number()
	    .required()
});
    

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next(); // Call the next middleware or route handler
});


// Centralized error handler
const errorHandler = (err, req, res, next) => {
	console.error(err)
	res.status(500).json({ message: 'Internal Server Error' });    
};


// Validation Middleware
const validate = (schema) => {
	return (req, res, next) => {

		const dataToValidate = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;

		const { error } = schema.validate(dataToValidate);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		next();
	};
};
app.use(errorHandler)

// Database connection
let db;
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


// Connect to the database
connectToDatabase();

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


app.post('/coin/metadata', validate(COIN_META_DATA_SCHEMA), async (req, res, next) => {
	try {
		await manager.insertCoin(db, req.body)
		return res.status(200).send("successfully inserted coin");
		
	} catch (error) {
		next(error);
	}
});

app.put('/coin/metadata', validate(COIN_META_DATA_SCHEMA), async (req, res, next) => {
	try {
		await manager.updateCoin(db, req.body)
		return res.status(200).send("successfully inserted coin");
	} catch (error) {
		next(error);
	}
});



app.post('/coin/priceInstance', validate(COIN_PRICE_INSTANCE_SCHEMA), async (req, res, next) => {
	try {
		await manager.insertPriceInstance(db, req.body)
		return res.status(200).send("successfully inserted priceInstance")
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

app.get('/coin/priceInstance/range', validate(COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA), async (req, res, next) => {	
	const { symbol, startDate, endDate} = req.query;
	try{
		const priceInstances = await manager.getPriceInstanceRange(db, symbol, startDate, endDate)
		res.status(200).send(priceInstances)
	}catch (error){
		next(error);
	}
});

app.get('/coin/all', validate(COIN_ALL_GET_SCHEMA), async (req, res, next) => {
	try{
		const coins = await manager.getAllCoinsWithLatestPriceInstance(db, req.query)
		res.status(200).send(coins)
	}catch (error){
		next(error);
	}
});

app.get('/coin', validate(COIN_GET_SPECIFIC_SCHEMA), async (req, res, next) => {
	const { symbol} = req.query;
	try{
		const coin = await manager.getSpecificCoin(db, symbol)
		console.log(coin)
		res.status(200).send(coin)
	}catch (error){
		next(error);
	}
});




