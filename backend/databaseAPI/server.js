import express from 'express';
import bodyParser from 'body-parser';
import * as manager from './manager.js'; // Ensure to add .js extension
import Joi from 'joi';

const db = await manager.connectDB()

const app = express();
const port = 3000;

const COIN_META_DATA_SCHEMA = Joi.object({
	name: Joi.string().min(1).required(),
	symbol: Joi.string().min(1).uppercase().required(),
	image: Joi.binary().required(), // Use binary for BSON
});

const COIN_PRICE_INSTANCE_SCHEMA = Joi.object({
	symbol: Joi.string().min(1).uppercase().required(),
	timestamp: Joi.date().iso().required(),
	price: Joi.number().required(), // Current price of the coin
	marketCap: Joi.number().optional(), // Market capitalization
	volume24: Joi.number().optional(), // Trading volume in the last 24 hours
	circulatingSupply: Joi.number().optional(), // Opening price for the current period
	totalSupply: Joi.number().optional(), // Closing price for the current period
	
	//idk maybe store this outside of priceInstance and update it whenever it changes
	open24: Joi.number().optional(), // Opening price for the current period
	close24: Joi.number().optional(), // Closing price for the current period
	high24: Joi.number().optional(), // Highest price in the last 24 hours
	low24: Joi.number().optional(), // Lowest price in the last 24 hours
    });
    

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next(); // Call the next middleware or route handler
});


// Connect to the database and set it in app.locals
(async () => {
	try {
	    const db = await manager.connectDB();
	    app.locals.db = db; // Store the db in app.locals
    
	    // Start the server
	    app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	    });
	} catch (error) {
	    console.error("Failed to start the server due to database connection error:", error);
	}
})();


// get coin metadata
app.get('/coin/metadata', async (req, res) => {
	// Accessing query parameters
	const { symbol} = req.query;

	if (!symbol ) {
		return res.status(400).send({ message: "Coin ID is required." });
	}

	try{
		const coinMetadata = await manager.getCoinMetadata(db, symbol)
		res.status(200).send(coinMetadata)
	}catch (error){
		console.error(error);
		res.status(500).send(error);
	}
});

app.post('/coin/metadata', async (req, res) => {
	try {
		// Validate the request body against the schema
		const { error } = COIN_META_DATA_SCHEMA.validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}
		await manager.insertCoin(db, req.body)
		return res.status(200).send("successfully inserted coin");
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

app.post('/coin/priceInstance', async (req, res) => {
	try {
		// Validate the request body against the schema
		const { error } = COIN_PRICE_INSTANCE_SCHEMA.validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		await manager.insertPriceInstance(db, req.body)
		return res.status(200).send("successfully inserted priceInstance")

	} catch (error) {
		console.log(error)
		res.status(500).send(error);
	}
});

// get current coin price
// price Instances are delimited by hour, so for different graph increments, use numberOfInstances equal to hours in that time increment. i.e 1 day = 24 increments.
// however, do make sure to add up whatever hours there are for the current day. i.e if you 1 day, then you really are doing the number of hours that have passed since midnight.
// so if it is 8pm, then you need to set numberOfInstances to 20.

// set numberOfInstances to 1 for latestPriceInstance
app.get('/coin/priceInstance', async (req, res) => {
	// Accessing query parameters
	const { symbol, numberOfInstances} = req.query;

	if (!symbol || !numberOfInstances) {
		return res.status(400).send({ message: "Coin ID and numberOfInstances is required." });
	}

	try{
		const priceInstance = await manager.getPriceInstance(db, symbol, numberOfInstances)
		console.log(priceInstance)
		res.status(200).send(priceInstance)
	}catch (error){
		console.error(error);
		res.status(500).send(error);
	}
});

// get current coin price
app.get('/coin/range', async (req, res) => {
	// Accessing query parameters
	const { start, end } = req.query;
});





