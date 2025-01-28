import fs from 'fs';
import dotenv from "dotenv"
import readline from 'readline';

dotenv.config();

const CONN_BATCH_SIZE = 300;
const KEY = process.env.CMC_API_KEY;
const COIN_IDS_TO_TRACK = readLineFromFile("coins.txt", 1);
const PORT = process.env.PORT || 3000;


function readLineFromFile(filePath, lineNumber) {
	const data = fs.readFileSync(filePath, 'utf8');
	const lines = data.split('\n');
	
	if (lineNumber < 1 || lineNumber > lines.length) {
	    throw new Error(`Line number ${lineNumber} is out of range.`);
	}
	
	return lines[lineNumber - 1].trim(); // Trim whitespace
}

async function removeDuplicates(){
	const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${COIN_IDS_TO_TRACK}`, {
		method: "GET",
		headers: { "X-CMC_PRO_API_KEY": KEY },
	});
	const dataJson = await response.json();
	let uniqueString = ""
	let count = 0
	const symbolSet = new Set()
	Object.entries(dataJson["data"]).map(([key,value]) => { // Destructure to get coin
		if (!symbolSet.has(value.symbol)){
			symbolSet.add(value.symbol)
			uniqueString+=value.id+","
			count +=1
		}
	});
	uniqueString = uniqueString.substring(0,uniqueString.length-2)
}

async function initDB(){
	const initialCoins = await fetchMetadata();
	if (!initialCoins) return; // Exit early if fetch failed
    
	let numOfSuccess = 0;
	let numOfFail = 0;

	for (const coin of initialCoins) {
		try {
		    const response = await fetch(`http://localhost:${PORT}/coin/metadata`, {
			method: "POST",
			headers: {
			    'Content-Type': 'application/json',
			    "X-API-Key": process.env.DAPI_API_KEY
			},
			body: JSON.stringify(coin),
		    });
	
		    if (!response.ok) {
			throw new Error(`Failed response: ${response.statusText}`);
		    }
	
		    numOfSuccess++;
		} catch (error) {
		    console.error(`Error inserting coin: ${error.message}`);
		    numOfFail++;
		}
		
		readline.cursorTo(process.stdout, 0)
		readline.clearLine(process.stdout, 0)
		console.log(`Requests success: ${numOfSuccess}, Fail: ${numOfFail}`);
	    }
}

async function fetchMetadata() {
    console.log("Fetching coin info for 1000 coins...");
    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${COIN_IDS_TO_TRACK}`, {
            method: "GET",
            headers: { "X-CMC_PRO_API_KEY": KEY },
        });

        const dataJson = await response.json();
        return generateCoinMetadataDTOs(dataJson.data);
    } catch (error) {
        console.error(`Error fetching initial data: ${error.message}`);
        return null;
    }
}

async function generateCoinMetadataDTOs(dataJson) {
    return Object.entries(dataJson).map(([key, coin]) => ({
        name: coin.name,
        symbol: coin.symbol,
        description: coin.description,
        logo: coin.logo,
    }));
}



async function fetchPriceInstanceData() {
	console.log("Fetching price instances of 1000 coins...");
	try {
	    const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${COIN_IDS_TO_TRACK}`, {
		method: "GET",
		headers: { "X-CMC_PRO_API_KEY": KEY },
	    });
    
	    const dataJson = await response.json();
	    return generatePriceInstanceDTOs(dataJson.data);
	} catch (error) {
	    console.error(`Error fetching price instance data: ${error.message}`);
	    return null;
	}
}


async function generatePriceInstanceDTOs(dataJson) {
	return Object.entries(dataJson).map(([key, coin]) => ({
	    symbol: coin.symbol,
	    timestamp: coin.last_updated,
	    price: coin.quote.USD.price,
	    market_cap: coin.quote.USD.market_cap,
	    volume_change_24h: coin.quote.USD.volume_change_24h,
	    circulating_supply: coin.circulating_supply,
	    total_supply: coin.total_supply,
	    fully_diluted_market_cap: coin.quote.USD.fully_diluted_market_cap,
	    percent_change_1h: coin.quote.USD.percent_change_1h,
	    percent_change_24h: coin.quote.USD.percent_change_24h,
	    percent_change_7d: coin.quote.USD.percent_change_7d,
	}));
}

async function insertPriceInstances(priceInstances) {
	let successes = 0
	let failures = 0
	const queue = [...priceInstances]
	const errors =[]

	const processPriceInstance  = async (priceInstance)=>{
		try {
			const response = await fetch(`http://localhost:${PORT}/coin/priceInstance`, {
			    method: "POST",
			    headers: { 
				'Content-Type': 'application/json',
				"X-API-Key": process.env.DAPI_API_KEY
			     },
			    body: JSON.stringify(priceInstance),

			});
	    
			if (!response.ok) {
			    throw new Error(`Failed to insert price instance for ${priceInstance.symbol}: ${response.statusText}`);
			}
			successes += 1;
		} catch (error) {
			errors.push(error)
			failures += 1;
		}
		// Log the current status after each request
		readline.cursorTo(process.stdout, 0,6);
		readline.clearLine(process.stdout, 0);
		console.log(`Requests success: ${successes}, Fail: ${failures}`);
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
	console.log(`Final Requests success: ${successes}, Fail: ${failures}`);
}

async function updateMetadata(metadatas) {
	let successes = 0
	let failures = 0
	const queue = [...metadatas]
	const errors = []

	const processMetadata = async (metadata)=>{
		try {
			const response = await fetch(`http://localhost:${PORT}/coin/metadata`, {
				method: "PUT",
				headers: { 
					'Content-Type': 'application/json',
					"X-API-Key": process.env.DAPI_API_KEY
				},
				body: JSON.stringify(metadata),
			});
		
			if (!response.ok) {
			
				throw new Error(`Failed to insert price instance for ${metadata.symbol}: ${response.statusText}`);
			}
			successes += 1
			} catch (error) {
				errors.push(error)
				failures +=1
		}
		// Log the current status after each request
		readline.cursorTo(process.stdout, 0,4);
		readline.clearLine(process.stdout, 0);
		console.log(`Requests success: ${successes}, Fail: ${failures}`);
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
	console.log(`Final Requests success: ${successes}, Fail: ${failures}`);
}


const runAtStartOf = async () => {
	console.log('Running task at :', new Date().toISOString());
	const metadatas = await fetchMetadata();
	console.log("updating METADATA")
	if (metadatas){
		await updateMetadata(metadatas);
	}

	const priceInstances = await fetchPriceInstanceData();
	console.log("inserting prices")
	if (priceInstances) {
	    await insertPriceInstances(priceInstances);
	}
};



const checkForStartOfHour = () => {
	const now = new Date();
	console.clear();
	console.log(`Time is currently ${now}`);

	if (now.getMinutes() === 0 && now.getSeconds() === 0) {
		runAtStartOf();
	}
};

const checkForStartOfMinute = () => {
	const now = new Date();
	console.clear();
	console.log(`Time is currently ${now}`);

	if (now.getSeconds() === 0) {
		try{
			runAtStartOf();
		}catch(err){
			console.error(err)
		}
	}
};
// await initDB()
setInterval(checkForStartOfHour, 1000);
// setInterval(checkForStartOfMinute, 1000);
// runAtStartOf()

// await removeDuplicates()



