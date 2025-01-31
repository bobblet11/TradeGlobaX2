import fs from 'fs';
import dotenv from "dotenv"
// import readline from 'readline';
import { getCoinData, generatePriceInstanceDTOs, generateCoinMetadataDTOs } from './Adapter/coinmarketcap.js';
import { postCoinData } from './Adapter/restful.js';

dotenv.config();

const CONN_BATCH_SIZE = 100;
const COINS_PATH = process.env.COINS_PATH;
const COIN_IDS_TO_TRACK = readLineFromFile(COINS_PATH, 1);


function readLineFromFile(filePath, lineNumber) {
	const data = fs.readFileSync(filePath, 'utf8');
	const lines = data.split('\n');

	if (lineNumber < 1 || lineNumber > lines.length) {
		throw new Error(`Line number ${lineNumber} is out of range.`);
	}

	return lines[lineNumber - 1].trim(); // Trim whitespace
}

// async function initDB() {
// 	const initialCoins = await fetchMetadata();
// 	if (!initialCoins) return;

// 	let numOfSuccess = 0;
// 	let numOfFail = 0;

// 	for (const coin of initialCoins) {
// 		const response = await postCoinData("metadata", coin);
// 		if (response) {
// 			numOfSuccess++;
// 		} else {
// 			numOfFail++;
// 		}

// 		readline.cursorTo(process.stdout, 0)
// 		readline.clearLine(process.stdout, 0)
// 		console.log(`Requests success: ${numOfSuccess}, Fail: ${numOfFail}`);
// 	}
// }

async function fetchMetadata() {
	console.log("Fetching coin info for 1000 coins...");
	const response = await getCoinData(`info?id=${COIN_IDS_TO_TRACK}`);
	return generateCoinMetadataDTOs(response);
}

async function fetchPriceInstanceData() {
	console.log("Fetching price instances of 1000 coins...");
	const respose = await getCoinData(`quotes/latest?id=${COIN_IDS_TO_TRACK}`);

	return generatePriceInstanceDTOs(respose);
}


async function insertPriceInstances(priceInstances) {
	let successes = 0
	let failures = 0
	const queue = [...priceInstances]

	const processPriceInstance = async (priceInstance) => {
		const response = await postCoinData("priceInstance", priceInstance);
		if (response) {
			successes += 1;
		}
		else {
			failures += 1;
		}
	}

	// Processing function to control concurrency
	const processQueue = async () => {
		while (queue.length > 0) {
			// Slice the queue to get the next batch of requests
			const batch = queue.splice(0, CONN_BATCH_SIZE);
			await Promise.all(batch.map(processPriceInstance));
		}
	};

	// Start processing the queue
	await processQueue();
	console.log(`PRICE INSTANCE: Final Requests success: ${successes}, Fail: ${failures}`);
}

async function updateMetadata(metadatas) {
	let successes = 0
	let failures = 0
	const queue = [...metadatas]

	const processMetadata = async (metadata) => {
		const response = await postCoinData("metadata", metadata, "PUT");
		if (response) {
			successes += 1;
		}
		else {
			failures += 1;
		}
	}

	// Processing function to control concurrency
	const processQueue = async () => {
		while (queue.length > 0) {
			// Slice the queue to get the next batch of requests
			const batch = queue.splice(0, CONN_BATCH_SIZE);
			await Promise.all(batch.map(processMetadata));
		}
	};

	// Start processing the queue
	await processQueue();
	console.log(`METADATA: Final Requests success: ${successes}, Fail: ${failures}`);
}


const runAtStartOf = async () => {
	console.log('Running task at :', new Date().toISOString());
	console.log("Fetching data from coinmarketcap")
	const metadatas = await fetchMetadata();
	console.log("Fetching data from coinmarketcap")
	const priceInstances = await fetchPriceInstanceData();
	console.log("updating METADATA")
	if (metadatas) {
		await updateMetadata(metadatas);
	}

	console.log("inserting prices")
	if (priceInstances) {
		await insertPriceInstances(priceInstances);
	}
};



const checkForStartOfHour = () => {
	const now = new Date();

	if (now.getMinutes() === 0) {
		console.log(`Time is currently ${now}`);
		runAtStartOf();
	}
};

// const checkForStartOfMinute = () => {
// 	const now = new Date();
// 	if (now.getSeconds() === 0 && now.getMinutes() % 5 === 0) {
// 		try {
// 			console.log(`Time is currently ${now}`);
// 			runAtStartOf();
// 		} catch (err) {
// 			console.error(err)
// 		}
// 	}
// };


setInterval(checkForStartOfHour, 1000);