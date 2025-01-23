import fs from 'fs';
import dotenv from "dotenv"

dotenv.config();

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


async function initDB(){
	const initialCoins = await fetchInitData();
	if (!initialCoins) return; // Exit early if fetch failed
    
	let numOfSuccess = 0;
	let numOfFail = 0;

	for (const coin of initialCoins) {
		try {
		    const response = await fetch(`http://localhost:${PORT}/coin/metadata`, {
			method: "POST",
			headers: {
			    'Content-Type': 'application/json'
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
	
		console.clear();
		console.log(`Requests success: ${numOfSuccess}, Fail: ${numOfFail}`);
	    }
}

async function fetchInitData() {
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
	const requests = priceInstances.map(async (priceInstance) => {
	    try {
		const response = await fetch(`http://localhost:${PORT}/coin/priceInstance`, {
		    method: "POST",
		    headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(priceInstance),
		});
    
		if (!response.ok) {
		    throw new Error(`Failed to insert price instance for ${priceInstance.symbol}: ${response.statusText}`);
		}
	    } catch (error) {
		console.error(error.message);
	    }
	});
}


const runAtStartOfHour = async () => {
	console.log('Running task at the start of the hour:', new Date().toISOString());
	const priceInstances = await fetchPriceInstanceData();
	
	if (priceInstances) {
	    await insertPriceInstances(priceInstances);
	    console.log(`Inserted ${priceInstances.length} price instances.`);
	}
};

const checkForStartOfHour = () => {
	const now = new Date();
	console.clear();
	console.log(`Time is currently ${now}`);

	if (now.getMinutes() === 0 && now.getSeconds() === 0) {
		runAtStartOfHour();
	}
};
// await initDB()
// setInterval(checkForStartOfHour, 1000);
// console.log('Running task at the start of the hour:', new Date().toISOString());
// const priceInstances = await fetchPriceInstanceData();

// if (priceInstances) {
//     await insertPriceInstances(priceInstances);
//     console.log(`Inserted ${priceInstances.length} price instances.`);
// }


let response = await fetch(`http://localhost:${PORT}/coin/all?startCoin=0&endCoin=10`, {
	method: "GET",
	headers: { 'Content-Type': 'application/json' },
});
console.log(response.status)
response=await response.json()
console.log(response)

