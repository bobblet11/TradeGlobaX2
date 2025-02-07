import { fetchMetadata, fetchPriceInstanceData } from "./Utils/coinMarketAPIFunctions.js";
import { insertPriceInstances, putMetadatas } from "./databaseFunctions.js";
import { log } from "../logger.js";

const runAtStartOf = async () => {
	log("Main", "Populating database with latest market data");
	const metadatas = await fetchMetadata();
	const priceInstances = await fetchPriceInstanceData();

	if (metadatas) {
		await putMetadatas(metadatas);
	}

	if (priceInstances) {
		await insertPriceInstances(priceInstances);
	}
};

let ranScript = false;
let pinged = false;

const checkForStartOfHour = () => {
	const now = new Date();
	if (now.getSeconds() === 0) {
		log("Check for start of hour", "Time-check");
	}

	if (now.getMinutes() === 30) {
		if (!pinged) {
			pingRender();
			pinged = true;
		}
	} else {
		pinged = false;
	}

	if (now.getMinutes() === 0) {
		if (!ranScript) {
			runAtStartOf();
			ranScript = true;
		}
	} else {
		ranScript = false
	}
};

runAtStartOf();


