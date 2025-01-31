import dotenv from "dotenv"
dotenv.config();

const KEY = process.env.CMC_API_KEY
const COIN_INFO_URL = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/"

export async function getCoinData(endpointPath) {
    try {
        const response = await fetch(`${COIN_INFO_URL}${endpointPath}`, {
            method: "GET",
            headers: { "X-CMC_PRO_API_KEY": KEY },
        });

        const dataJson = await response.json();

        return dataJson.data;
    } catch (error) {
        console.error(`Error fetching data at endpoint "${endpointPath}" because: ${error.message}`);
        return null;
    }
}

export function generatePriceInstanceDTOs(dataJson) {
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

export function generateCoinMetadataDTOs(dataJson) {
    if (!dataJson) return null;
    return Object.entries(dataJson).map(([_, coin]) => ({
        name: coin.name,
        symbol: coin.symbol,
        description: coin.description,
        logo: coin.logo,
    }));
} 