import fs from 'fs';
import dotenv from "dotenv"
import readline from 'readline';

dotenv.config();

const CONN_BATCH_SIZE = 100;
const RETRY_LIMIT = 3; // Number of retry attempts
const RETRY_DELAY = 1000; // Initial delay for retries in ms
const KEY = process.env.CMC_API_KEY;
const COINS_PATH = process.env.COINS_PATH;
const PORT = process.env.PORT || 3000;

const COIN_IDS_TO_TRACK = safeReadLineFromFile(COINS_PATH, 1);

const options = {
	timeZone: 'Asia/Hong_Kong',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false // Set to true for 12-hour format
};

// Custom Error Types
class APIError extends Error {
	constructor(message, statusCode, response) {
	  super(message);
	  this.name = "APIError";
	  this.statusCode = statusCode;
	  this.response = response;
	}
      }
      
      class NetworkError extends Error {
	constructor(message) {
	  super(message);
	  this.name = "NetworkError";
	}
      }
      
      class FileError extends Error {
	constructor(message) {
	  super(message);
	  this.name = "FileError";
	}
}

// Utility: Centralized error logging
function logError(error) {
	console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`);
	if (error.stack) console.error(error.stack);
	if (error.response) console.error(`Response: ${JSON.stringify(error.response)}`);
}

// Utility: Retry logic with exponential backoff
async function withRetry(fn, args = [], retries = RETRY_LIMIT, delay = RETRY_DELAY) {
	let attempt = 0;
      
	while (attempt < retries) {
	  try {
	    return await fn(...args);
	  } catch (error) {
	    attempt++;
	    if (attempt >= retries) {
	      throw error; // Rethrow after exhausting retries
	    }
	    logError(error);
	    console.log(`Retrying (${attempt}/${retries}) in ${delay}ms...`);
	    await new Promise((resolve) => setTimeout(resolve, delay));
	    delay *= 2; // Exponential backoff
	  }
	}
}
    
// File reading with error handling
function safeReadLineFromFile(filePath, lineNumber) {
	try {
	  const data = fs.readFileSync(filePath, "utf8");
	  const lines = data.split("\n");
	  if (lineNumber < 1 || lineNumber > lines.length) {
	    throw new FileError(`Line number ${lineNumber} is out of range.`);
	  }
	  return lines[lineNumber - 1].trim();
	} catch (error) {
	  logError(error);
	  throw new FileError(`Failed to read file: ${filePath}`);
	}
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
	if (!initialCoins) return; 
    
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
		    console.error(`Error inserting coin: ${error}`);
		    numOfFail++;
		}
		
		readline.cursorTo(process.stdout, 0)
		readline.clearLine(process.stdout, 0)
		console.log(`Requests success: ${numOfSuccess}, Fail: ${numOfFail}`);
	    }
}

// Fetch metadata and implement retry logic
async function fetchMetadata() {
	console.log("Fetching coin info for 1000 coins...");
	return withRetry(async () => {
	  const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${COIN_IDS_TO_TRACK}`, {
	    method: "GET",
	    headers: { "X-CMC_PRO_API_KEY": KEY },
	  });
      
	  if (!response.ok) {
	    throw new APIError(
	      `Failed to fetch metadata: ${response.status} ${response.statusText}`,
	      response.status,
	      await response.json()
	    );
	  }
      
	  const dataJson = await response.json();
	  return generateCoinMetadataDTOs(dataJson.data);
	});
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

	    if (!response.ok){
		throw new Error({message: `response from coinMarketCap was NOT okay. ${response.status} ${response.statusText} ${response.json()}`})
		}
	    const dataJson = await response.json();
	    return generatePriceInstanceDTOs(dataJson.data);

	} catch (error) {
	    console.error(`Error fetching price instance data: ${error}`);
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

// Insert price instances with retry logic
async function insertPriceInstances(priceInstances) {
	let successes = 0;
	let failures = 0;
	const queue = [...priceInstances];
      
	const processPriceInstance = async (priceInstance) => {
	  return withRetry(async () => {
	    const response = await fetch(`http://localhost:${PORT}/coin/priceInstance`, {
	      method: "POST",
	      headers: {
		"Content-Type": "application/json",
		"X-API-Key": process.env.DAPI_API_KEY,
	      },
	      body: JSON.stringify(priceInstance),
	    });
      
	    if (!response.ok) {
	      throw new APIError(
		`Failed to insert price instance for ${priceInstance.symbol}`,
		response.status,
		await response.json()
	      );
	    }
	    successes++;
	  }, [], RETRY_LIMIT);
	};
      
	const processQueue = async () => {
	  while (queue.length > 0) {
	    const batch = queue.splice(0, CONN_BATCH_SIZE);
	    await Promise.all(batch.map(processPriceInstance)).catch((error) => {
	      logError(error);
	      failures += batch.length;
	    });
	  }
	};
      
	await processQueue();
	console.log(`PRICE INSTANCE: Final Requests success: ${successes}, Fail: ${failures}`);
}

async function updateMetadata(metadatas) {
	let successes = 0;
	let failures = 0;
	const queue = [...metadatas];
      
	const processMetadata = async (metadata) => {
	  return withRetry(async () => {
	    const response = await fetch(`http://localhost:${PORT}/coin/metadata`, {
	      method: "PUT",
	      headers: {
		"Content-Type": "application/json",
		"X-API-Key": process.env.DAPI_API_KEY,
	      },
	      body: JSON.stringify(metadata),
	    });
      
	    if (!response.ok) {
	      throw new APIError(
		`Failed to insert price instance for ${metadata.symbol}`,
		response.status,
		await response.json()
	      );
	    }
	    successes++;
	  }, [], RETRY_LIMIT);
	};
      
	const processQueue = async () => {
	  while (queue.length > 0) {
	    const batch = queue.splice(0, CONN_BATCH_SIZE);
	    await Promise.all(batch.map(processMetadata)).catch((error) => {
	      logError(error);
	      failures += batch.length;
	    });
	  }
	};
      
	await processQueue();
	console.log(`METADATA: Final Requests success: ${successes}, Fail: ${failures}`);
}


const runAtStartOf = async () => {
	console.log('Running task at :', new Date().toISOString());
	const metadatas = await fetchMetadata();
	const priceInstances = await fetchPriceInstanceData();

	console.log("updating METADATA")
	if (metadatas){
		await updateMetadata(metadatas);
	}
	console.log("inserting prices")
	if (priceInstances) {
	    await insertPriceInstances(priceInstances);
	}
};


const RenderURL = `https://cors-anywhere-pnd9.onrender.com`; // Replace with your Render URL

//Reloader Function
async function reloadWebsite() {
	try{
		const ping = await fetch(RenderURL+"/coin/metadata?symbol=BTC", {
			method: "GET",
		});
	}catch(error){
		console.log("PING FAIL")
		console.error(error)
	}	

}

let sent = false

const checkForStartOfHour = () => {
	const now = new Date();
	if (now.getSeconds() === 0) {
		console.log(`Time is currently ${now.toLocaleString('en-US', options)}`);
		reloadWebsite()
	}

	if (now.getMinutes() === 0) {
		if (!sent){
			console.log(`Time is currently GMT+0: ${now} GMT+8:${now.toLocaleString('en-US', options)}`);
			runAtStartOf().catch(logError);
			sent = true;
		}	
	}else{
		sent = false
	}
};

setInterval(checkForStartOfHour, 1000);


