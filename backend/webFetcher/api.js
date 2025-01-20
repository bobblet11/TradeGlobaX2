import fs from 'fs';

const KEY = "717d6948-4684-488c-b7a1-2cca131df220"
const COIN_IDS_TO_TRACK = readLineFromFile("./coins.txt", 1)

// Function to read a specific line from a text file
function readLineFromFile(filePath, lineNumber) {
	// Read the file synchronously
	const data = fs.readFileSync(filePath, 'utf8');
	
	// Split the data into an array of lines
	const lines = data.split('\n');
	
	// Check if the line number is valid
	if (lineNumber < 1 || lineNumber > lines.length) {
	  throw new Error(`Line number ${lineNumber} is out of range.`);
	}
      
	// Return the specific line (subtract 1 for zero-based indexing)
	return lines[lineNumber - 1];
}

async function fetchInitData(){
	let currentTime = new Date().getTime();
	let dataJson;
	let data;
	console.log("FETCHING COIN INFO OF 1000 COINS AT " + currentTime);

	try{	
		data = await fetch("https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id="+COIN_IDS_TO_TRACK,
		{ 
			method: "GET",
			headers: {"X-CMC_PRO_API_KEY": KEY,},
		})

		dataJson = await data.json();
		const coinMetaDataDTOs = generateCoinMetadataDTOs(dataJson["data"])
		return coinMetaDataDTOs
		
	}
	catch(error) {
		console.log(error);
		return null;
	} 
}

async function generateCoinMetadataDTOs(dataJson){
	try{
		const coinMetadatas = await Object.entries(dataJson).map(([key, coin])=>{
			return {
				name: 			coin.name,
				symbol:             	coin.symbol,
				description:		coin.description,
				logo: 			coin.logo,
			}
		})
		return coinMetadatas
	}
	catch (error){
		console.log(error)
		return null
	}
}


async function fetchPriceInstanceData(){
	let currentTime = new Date().getTime();
	let dataJson;
	let data;
	console.log("FETCHING PRICE INSTANCES OF 1000 COINS AT " + currentTime);

	try{
		data = await fetch("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id="+COIN_IDS_TO_TRACK,
		{ 
			method: "GET",
			headers: {"X-CMC_PRO_API_KEY": KEY,},
		})
		dataJson = await data.json();
		const priceInstancesData = generatePriceInstanceDTOs(dataJson["data"])
		return priceInstancesData
	}
	catch(error) {
		console.log(error);
		return null;
	}  
}


async function generatePriceInstanceDTOs(dataJson){
	try{	
		const priceInstances = await Object.entries(dataJson).map(([key, coin])=>{
			return {
				symbol:             coin.symbol,
				timestamp:          coin.last_updated,
				price:              coin.quote.USD.price,
				market_cap:         coin.quote.USD.market_cap,
				volume_change_24h:  coin.quote.USD.volume_change_24h,
				circulating_supply: coin.circulating_supply,
				total_supply:       coin.total_supply,
				fully_diluted_market_cap:coin.quote.USD.fully_diluted_market_cap,
				percent_change_1h:  coin.quote.USD.percent_change_1h,
				percent_change_24h: coin.quote.USD.percent_change_24h,
				percent_change_7d: coin.quote.USD.percent_change_7d,	
			}
		})
		console.log(priceInstances)
		return priceInstances
	}
	catch (error){
		console.log(error)
		return null
	}
}


await fetchPriceInstanceData()



