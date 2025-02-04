export const generatePriceInstanceDTOs = (dataJson) => {
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

export const generateCoinMetadataDTOs = (dataJson) => {
	return Object.entries(dataJson).map(([key, coin]) => ({
		name: coin.name,
		symbol: coin.symbol,
		description: coin.description,
		logo: coin.logo,
	}));
    }
    
