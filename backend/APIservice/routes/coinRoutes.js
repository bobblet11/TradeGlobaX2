import { updateCache, cacheCheck } from "../middlewares/cache.js";
import express from 'express';
import * as manager from '../middlewares/manager.js';
import { validate } from '../middlewares/validate.js';
import { sanitise } from "../middlewares/sanitize.js";
import { authenticateDbAccess } from "../middlewares/authentication.js";
import {
    COIN_META_DATA_GET_SCHEMA,
    COIN_ALL_GET_SCHEMA,
    COIN_PRICE_INSTANCE_GET_SCHEMA,
    COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA,
    COIN_META_DATA_SCHEMA,
    COIN_GET_SPECIFIC_SCHEMA,
    COIN_PRICE_INSTANCE_SCHEMA,
} from '../constants/schemas.js';
import { db } from "../server.js";

const router = express.Router();

router.post('/*', authenticateDbAccess());
router.put('/*', authenticateDbAccess());

router.get('', validate(COIN_GET_SPECIFIC_SCHEMA), sanitise(), async (req, res, next) => {
	const { symbol } = req.query;
	try {
		const coin = await manager.getSpecificCoin(db, symbol)
		return res.status(200).send(coin)
	} catch (error) {
		next(error);
	}
});


router.get('/all', validate(COIN_ALL_GET_SCHEMA), cacheCheck(), async (req, res, next) => {
	try {
		const coins = await manager.getAllCoinsWithLatestPriceInstance(db, req.query);
		updateCache(req, coins);
		return res.status(200).send(coins);
	} catch (error) {
		next(error);
	}
});


router.get('/metadata', validate(COIN_META_DATA_GET_SCHEMA), async (req, res, next) => {
	const { symbol } = req.query
	try {
		const coinMetadata = await manager.getCoinMetadata(db, symbol)
		return res.status(200).send(coinMetadata)
	} catch (error) {
		next(error);
	}
});


router.post('/metadata', validate(COIN_META_DATA_SCHEMA), sanitise(), async (req, res, next) => {
	try {
		await manager.insertCoin(db, req.body)
		return res.status(201).send("successfully inserted coin");

	} catch (error) {
		next(error);
	}
});

router.put('/metadata', validate(COIN_META_DATA_SCHEMA), sanitise(), async (req, res, next) => {
	try {
		await manager.updateCoin(db, req.body)
		return res.status(201).send("successfully updated coin");
	} catch (error) {
		next(error);
	}
});


router.post('/priceInstance', validate(COIN_PRICE_INSTANCE_SCHEMA), sanitise(), async (req, res, next) => {
	try {
		await manager.insertPriceInstance(db, req.body)
		return res.status(201).send("successfully inserted priceInstance")
	} catch (error) {
		next(error);
	}
});


router.get('/priceInstance', validate(COIN_PRICE_INSTANCE_GET_SCHEMA), async (req, res, next) => {
	const { symbol, numberOfInstances } = req.query
	try {
		const priceInstance = await manager.getPriceInstance(db, symbol, numberOfInstances)
		return res.status(200).send(priceInstance)
	} catch (error) {
		next(error);
	}
});


router.get('/priceInstance/range', validate(COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA), sanitise(), async (req, res, next) => {
	const { symbol, startDate, endDate } = req.query;
	try {
		const priceInstances = await manager.getPriceInstanceRange(db, symbol, startDate, endDate)
		return res.status(200).send(priceInstances)
	} catch (error) {
		next(error);
	}
});

export default router;