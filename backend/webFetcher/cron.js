import { fetchMetadata, fetchPriceInstanceData } from "./Utils/coinMarketAPIFunctions.js";
import { insertPriceInstances, putMetadatas } from "./databaseFunctions.js";
import { log } from "../logger.js";
import cron from 'node-cron';

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


// Schedule a task to run every hr
const job = cron.schedule('0 * * * *', () => {
	log("Check for start of hour", "-");
	try{
		runAtStartOf();
	}catch(error){
		console.error(error)
	}

});

job.start();


