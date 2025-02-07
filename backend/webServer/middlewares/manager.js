import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const uri =
	"mongodb+srv://" +
	USER +
	":" +
	PASSWORD +
	"@cluster0.mpisr9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export async function connectDB() {
	let db = null;
	try {
		await client.connect();

		await client.db("admin").command({ ping: 1 });
		console.log("Successfully connected to MongoDB!");

		db = client.db(DB_NAME);
		return db;
	} catch (error) {
		console.error("Database connection failed:", error.message);
		throw new Error("Database connection failed");
	}
}

export async function getPriceInstance(db, symbol, count) {
	// Replace with your collection name
	const collection = db.collection("coin");

	let n = parseInt(count, 10);
	const coin = await collection.findOne(
		{ symbol },
		{
			projection: {
				name: 1,
				symbol: 1,
				dailyMax: 1,
				dailyMin: 1,
				priceInstances: { $slice: -n },
			},
		}
	);

	if (!coin || !coin.priceInstances || coin.priceInstances.length === 0) {
		throw new Error("No price instances found for this coin.");
	}

	return coin.priceInstances.reverse();
}

export async function getSpecificCoin(db, symbol) {
	// Replace with your collection name
	const collection = db.collection("coin");
	const coin = await collection.findOne(
		{ symbol },
		{
			projection: {
				name: 1,
				symbol: 1,
				description: 1,
				logo: 1,
				dailyMax: 1,
				dailyMin: 1,
				priceInstances: { $slice: -1 },
			},
		}
	);

	if (!coin || !coin.priceInstances || coin.priceInstances.length === 0) {
		throw new Error("No price instances found for this coin.");
	}
	return coin;
}

export async function getPriceInstanceRange(db, symbol, startDate, endDate) {
	const collection = db.collection("coin");
	const result = await collection
		.aggregate([
			{ $match: { symbol } },
			{
				$project: {
					priceInstances: {
						$filter: {
							input: {
								$map: {
									input: "$priceInstances",
									as: "instance",
									in: {
										$mergeObjects: [
											"$$instance",
											{
												timestampDate: {
													$dateFromString: {
														dateString: "$$instance.timestamp",
													},
												},
											},
										],
									},
								},
							},
							as: "instanceWithDate",
							cond: {
								$and: [
									{
										$gte: [
											"$$instanceWithDate.timestampDate",
											{ $dateFromString: { dateString: startDate } }, // Convert startDate to date
										],
									},
									{
										$lte: [
											"$$instanceWithDate.timestampDate",
											{ $dateFromString: { dateString: endDate } }, // Convert endDate to date
										],
									},
								],
							},
						},
					},
				},
			},
			{ $match: { "priceInstances.0": { $exists: true } } }, // Ensures documents with price instances are returned
		])
		.toArray();
	if (!result || result.length === 0 || result[0].priceInstances.length === 0) {
		throw new Error(
			"No price instances found for this coin within the specified date range."
		);
	}
	return result[0].priceInstances.reverse();
}

export async function authenticateKey(db, key) {
	const collection = db.collection("user");

	// Use a case-insensitive search if needed, or ensure `key` is sanitized
	const user = await collection.findOne({ key });

	if (!user) {
		throw new Error("Cannot authenticate user");
	}

	return user; // Optionally return the user object if needed
}

export async function getCoinMetadata(db, symbol) {
	const collection = db.collection("coin");

	const coin = await collection.findOne(
		{ symbol },
		{ projection: { priceInstances: 0 } }
	);

	if (!coin) {
		throw new Error("No coin found.");
	}

	return coin;
}

export async function insertCoin(db, coinMetadata) {
	const collection = db.collection("coin");

	const existingCoin = await collection.findOne({
		symbol: coinMetadata.symbol,
	});
	if (existingCoin) {
		throw new Error(`Coin with symbol ${coinMetadata.symbol} already exists.`);
	}

	const result = await collection.insertOne(coinMetadata);
	return result;
}

export async function updateCoin(db, coinMetadata) {
	const collection = db.collection("coin");

	try {
		const existingCoin = await collection.findOne({
			symbol: coinMetadata.symbol,
		});
		if (!existingCoin) {
			throw new Error(
				`Coin with symbol ${coinMetadata.symbol} does not exist.`
			);
		}

		const result = await collection.updateOne(
			{ symbol: coinMetadata.symbol },
			{
				$set: {
					name: coinMetadata.name,
					description: coinMetadata.description,
					logo: coinMetadata.logo,
				},
			}
		);

		return result;

	} catch (error) {
		throw error;
	}
}

export async function insertPriceInstance(db, coinPriceInstance) {
	const collection = db.collection("coin");
	const symbol = coinPriceInstance.symbol;
	delete coinPriceInstance.symbol;

	const existingCoin = await collection.findOne({ symbol });
	if (!existingCoin) {
		throw new Error(`Coin with symbol ${symbol} does not exist.`);
	}

	const existingTimestamp = await collection.findOne({
		symbol,
		"priceInstances.timestamp": coinPriceInstance.timestamp,
	});

	if (existingTimestamp) {
		throw new Error(
			`Price instance with timestamp ${coinPriceInstance.timestamp} already exists for coin ${symbol}.`
		);
	}
	const updateData = {
		$push: { priceInstances: coinPriceInstance },
		$set: {},
	};

	const today = new Date(coinPriceInstance.timestamp);
	const dayStart = new Date(
		Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
	);
	const dayEnd = new Date(
		Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1)
	);
	const existingDailyInstances = await collection
		.aggregate([
			{ $match: { symbol } },
			{
				$project: {
					priceInstances: {
						$filter: {
							input: {
								$map: {
									input: "$priceInstances",
									as: "instance",
									in: {
										$mergeObjects: [
											"$$instance",
											{
												timestampDate: {
													$dateFromString: {
														dateString: "$$instance.timestamp",
													},
												},
											},
										],
									},
								},
							},
							as: "instanceWithDate",
							cond: {
								$and: [
									{ $gte: ["$$instanceWithDate.timestampDate", dayStart] },
									{ $lte: ["$$instanceWithDate.timestampDate", dayEnd] },
								],
							},
						},
					},
				},
			},
			{ $match: { "priceInstances.0": { $exists: true } } }, // Ensures documents with price instances are returned
		])
		.toArray();

	if (existingDailyInstances.length > 0) {
		const priceInstances = existingDailyInstances[0].priceInstances;
		priceInstances.push(coinPriceInstance);
		updateData.$set.dailyMax = Math.max(
			...priceInstances.map((instance) => instance.price)
		);
		updateData.$set.dailyMin = Math.min(
			...priceInstances.map((instance) => instance.price)
		);
	} else {
		updateData.$set.dailyMax = coinPriceInstance.price;
		updateData.$set.dailyMin = coinPriceInstance.price;
	}

	const result = await collection.updateOne({ symbol }, updateData);
	if (result.modifiedCount === 0) {
		throw new Error(`Coin with symbol ${symbol} not found.`);
	}
}

export async function getAllCoinsWithLatestPriceInstance(db, query) {
	const collection = db.collection("coin");
	const queryParams = query && Object.keys(query).length > 0 ? query : null;
	let startCoin = null;
	let endCoin = null;
	if (queryParams) {
		startCoin = parseInt(query.startCoin, 10);
		endCoin = parseInt(query.endCoin, 10);
	}
	let result = null;
	if (startCoin !== null) {
		result = await collection
			.aggregate([
				{
					$project: {
						symbol: 1,
						logo: 1,
						latestPriceInstance: {
							$arrayElemAt: [
								{
									$sortArray: {
										input: "$priceInstances",
										sortBy: { timestamp: -1 },
									},
								},
								0,
							],
						},
					},
				},
				{ $match: { latestPriceInstance: { $exists: true } } },
				{
					$addFields: {
						marketCap: { $ifNull: ["$latestPriceInstance.market_cap", 0] }, // Extract marketCap
					},
				},
				{ $sort: { marketCap: -1 } }, // Sort by marketCap in descending order
				{ $skip: startCoin },
				{ $limit: endCoin - startCoin },
				{
					$project: {
						marketCap: 0, // Exclude marketCap from final result
					},
				},
			])
			.toArray();
	} else {
		result = await collection
			.aggregate([
				{
					$project: {
						symbol: 1,
						logo: 1,
						latestPriceInstance: {
							$arrayElemAt: [
								{
									$sortArray: {
										input: "$priceInstances",
										sortBy: { timestamp: -1 },
									},
								},
								0,
							],
						},
					},
				},
				{ $match: { latestPriceInstance: { $exists: true } } },
				{
					$addFields: {
						marketCap: { $ifNull: ["$latestPriceInstance.market_cap", 0] }, // Extract marketCap
					},
				},
				{ $sort: { marketCap: -1 } }, // Sort by marketCap in descending order
				{
					$project: {
						marketCap: 0, // Exclude marketCap from final result
					},
				},
			])
			.toArray();
	}

	if (result.length === 0) {
		throw new Error("No coins found with price instances.");
	}

	return result;
}

export async function insertUser(db, user) {
	const collection = db.collection("user");

	user.password = bcrypt.hash(user.password, 10);
	const existingUser = await collection.findOne({ key: user.username });
	if (existingUser) {
		throw new Error(`User with key ${user.username} already exists.`);
	}

	const result = await collection.insertOne(user);
	return result;
}

export async function validateUser(db, user) {
	const collection = db.collection("user");

	const existingUser = await collection.findOne({
		key: user.username,
	});
	if (!existingUser) {
		throw new Error("User not found.");
	}
	if (!bcrypt.compare(user.password, existingUser.password)) {
		throw new Error("Invalid password.");
	}
}
