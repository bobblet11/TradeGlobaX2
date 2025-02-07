import { processQueue } from "./Utils/requestUtils.js";
import { log } from "../logger.js";
import { fetchMetadata } from "./Utils/coinMarketAPIFunctions.js";

export const insertPriceInstances = async (priceInstances) => {
	const queue = [...priceInstances];
	const failures = await processQueue(queue, "POST", "/coin/priceInstance");
	const successes = priceInstances.length - failures;
	log('Insert Price Instances', `Final Requests success: ${successes}, Fail: ${failures}`)
}

export const putMetadatas = async (metadatas) => {
	const queue = [...metadatas];
	const failures = await processQueue(queue, "PUT", "/coin/metadata");
	const successes = metadatas.length - failures;
	log('Put Metadatas', `Final Requests success: ${successes}, Fail: ${failures}`)
}

export const postMetadatas = async (metadatas) => {
	const queue = [...metadatas];
	const failures = await processQueue(queue, "PUT", "/coin/metadata");
	const successes = metadatas.length - failures;
	log('Put Metadatas', `Final Requests success: ${successes}, Fail: ${failures}`)
}

export const initialiseDatabase = async () => {
	log("Initialise Database", `Database initialisation starting`)
	const initialCoins = await fetchMetadata();
	log("Initialise Database", `Inserting ${initialCoins.length} coins into database`)
	if (!initialCoins) return;
	postMetadatas(initialCoins);
}
