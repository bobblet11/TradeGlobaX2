import { DB_API_KEY, DB_API_PORT } from "./config.js";
import { RETRY_DELAY,  RETRY_LIMIT } from "./config.js";
import { logError, log } from "./logger.js";

async function withRetry(callback, args = [], retries = RETRY_LIMIT, delay = RETRY_DELAY) {
	let attempt = 0;
      
	while (attempt < retries) {
		try {
			return await callback(...args);
		} catch (error) {
			attempt++;
			if (attempt >= retries) {
				throw error;
			}

			logError(error)
			log('Request', `Retrying (${attempt}/${retries}) in ${delay}ms...`)
			await new Promise((resolve) => setTimeout(resolve, delay));
			delay *= 2;
		}
	}
}
 

const processRequest = async ( method, path, body) => {
	return withRetry(
		async () => {
	  		const response = await fetch(`http://localhost:${DB_API_PORT}${path}`, {
	    		method: method,
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": DB_API_KEY,
			},
			body: JSON.stringify(body),
		});
	
		if (!response.ok) {
			throw new APIError(
				`Failed to insert price instance for ${priceInstance.symbol}\nREASON: ${response.statusText}`,
				response.status,
				await response.json()
			);
		}
	  
		successes++;
	}, [], RETRY_LIMIT);
};

export const processQueue = async (queue, method, path) => {
	while (queue.length > 0) {
		const batch = queue.splice(0, CONN_BATCH_SIZE);
		    await Promise.all(
			batch.map(
				coin => processRequest( method, path, coin))
			).catch((error) => {
				//will only handle errors if the retry limit is reached.
				logError(error);
				failures += batch.length;
			}
		);
	}
};