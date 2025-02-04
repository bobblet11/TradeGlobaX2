import { COIN_IDS_TO_TRACK } from "../config.js";
import { log } from "../Utils/logger.js";
import { APIError } from "../errorHandling.js";
import { withRetry } from "./requestUtils.js";
import { MARKET_CAP_API_KEY } from "../config.js";

function generatePriceInstanceDTOs(dataJson) {
	if (!dataJson) return null;
	return Object.entries(dataJson).map(([_, coin]) => ({
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

function generateCoinMetadataDTOs(dataJson) {
	if (!dataJson) return null;
	return Object.entries(dataJson).map(([_, coin]) => ({
		name: coin.name,
		symbol: coin.symbol,
		description: coin.description,
		logo: coin.logo,
	}));
}

export const fetchMetadata = () => {
	log("CoinMarketCap API: Metadata", "Starting fetch for 1000 coins");

	return withRetry(
		async () => {
			const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${COIN_IDS_TO_TRACK}`, {
				method: "GET",
				headers: { "X-CMC_PRO_API_KEY": MARKET_CAP_API_KEY },
			});

			if (!response.ok) {
				throw new APIError(
					`Failed to fetch metadata: ${response.status} ${response.statusText}`,
					response.status,
					await response.json(),
					`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${COIN_IDS_TO_TRACK}`,
					"N/A",
					"GET"
				);
			}

			const dataJson = await response.json();
			return generateCoinMetadataDTOs(dataJson.data);
		}
	);
}


export const fetchPriceInstanceData = async () => {
	log("CoinMarketCap API: PriceInstance", "Starting fetch for 1000 coins");

	return withRetry(
		async () => {
			const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${COIN_IDS_TO_TRACK}`, {
				method: "GET",
				headers: { "X-CMC_PRO_API_KEY": MARKET_CAP_API_KEY },
			});

			if (!response.ok) {
				throw new APIError(
					`Failed to fetch price instances: ${response.status} ${response.statusText}`,
					response.status,
					await response.json(),
					`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${COIN_IDS_TO_TRACK}`,
					"N/A",
					"GET"
				);
			}

			const dataJson = await response.json();
			return generatePriceInstanceDTOs(dataJson.data);
		}
	);
}
