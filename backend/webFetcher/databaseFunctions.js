import { processQueue } from "./requestUtils.js";
import { log } from "./logger.js";
import { fetchMetadata } from "./coinMarketAPIFunctions.js";

export const insertPriceInstances = async (priceInstances) => {
	let successes = 0;
	let failures = 0;
	const queue = [...priceInstances];
	await processQueue(queue, "POST", "/coin/priceInstance");
	log('Insert Price Instances', `Final Requests success: ${successes}, Fail: ${failures}`)
}

export const putMetadatas = async (metadatas) => {
	let successes = 0;
	let failures = 0;
	const queue = [...metadatas];
	await processQueue(queue, "PUT", "/coin/metadata");
	log('Put Metadatas', `Final Requests success: ${successes}, Fail: ${failures}`)
}

export const postMetadatas = async (metadatas) => {
	let successes = 0;
	let failures = 0;
	const queue = [...metadatas];
	await processQueue(queue, "PUT", "/coin/metadata");
	log('Put Metadatas', `Final Requests success: ${successes}, Fail: ${failures}`)
}

export const initialiseDatabase = async () => {
	log("Initialise Database", `Database initialisation starting`)
	const initialCoins = await fetchMetadata();
	log("Initialise Database", `Inserting ${initialCoins.length} coins into database`)
	if (!initialCoins) return;
    	postMetadatas(initialCoins);
}
