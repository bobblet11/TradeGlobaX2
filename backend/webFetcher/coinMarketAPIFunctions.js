import { COIN_IDS_TO_TRACK } from "./config.js";
import { log } from "./logger.js";
import { generateCoinMetadataDTOs, generatePriceInstanceDTOs } from "./adapters.js";
import { APIError } from "./errorHandling.js";

export const fetchMetadata = () => {
	log("CoinMarketCap API: Metadata", "Starting fetch for 1000 coins");

	return withRetry(
		async () => {
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
		}
	);
}


export const fetchPriceInstanceData  = async () => {
	log("CoinMarketCap API: PriceInstance", "Starting fetch for 1000 coins");

	
	return withRetry(
		async () => {
			const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${COIN_IDS_TO_TRACK}`, {
				method: "GET",
				headers: { "X-CMC_PRO_API_KEY": KEY },
			});
      
			if (!response.ok) {
				throw new APIError(
					`Failed to fetch price instances: ${response.status} ${response.statusText}`,
					response.status,
					await response.json()
				);
			}
      
			const dataJson = await response.json();
			return generatePriceInstanceDTOs(dataJson.data);
		}
	);
}
