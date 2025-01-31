import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 3000;
const COIN_POST_PATH = `http://localhost:${PORT}/coin/`;
const KEY = process.env.DAPI_API_KEY;


export async function postCoinData(endpointPath, body, update_method = "POST") {
    try {
        const response = await fetch(`${COIN_POST_PATH}${endpointPath}`, {
            method: update_method,
            headers: {
                'Content-Type': 'application/json',
                "X-API-Key": KEY
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Failed response at endpoint ${endpointPath}: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error(`Error inserting coin at endpoint ${endpointPath}: ${error}`);
        return false;
    }
}