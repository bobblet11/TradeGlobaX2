import { ROOT_URL, DB_API_KEY, DB_API_PORT } from "../config.js";
import { RETRY_DELAY, RETRY_LIMIT } from "../config.js";
import { CONN_BATCH_SIZE } from "../config.js";
import { APIError, NetworkError } from "../errorHandling.js";
import { logError, log } from "../Utils/logger.js";


export async function withRetry(callback, args = [], retries = RETRY_LIMIT, delay = RETRY_DELAY) {
	let attempt = 0;

	while (attempt < retries) {
		try {
			return await callback(...args);
		} catch (error) {
			attempt++;
			if (attempt >= retries) {
				throw error;
			}
			log('Request', `Retrying (${attempt}/${retries}) in ${delay}ms...`)
			await new Promise((resolve) => setTimeout(resolve, delay));
			delay *= 2;
		}
	}
}


const processRequest = async (method, path, body) => {
	return withRetry(
		async () => {
			const response = await fetch(`${ROOT_URL}:${DB_API_PORT}${path}`, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": DB_API_KEY,
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new APIError(
					`Failed Request`,
					response.status,
					await response.json(),
					`${ROOT_URL}:${DB_API_PORT}${path}`,
					body,
					method
				);
			}
		}, [], RETRY_LIMIT
	);
};

export const processQueue = async (queue, method, path) => {
	let failures = 0;
	while (queue.length > 0) {
		const batch = queue.splice(0, CONN_BATCH_SIZE);
		await Promise.all(
			batch.map(
				coin => processRequest(method, path, coin))
		).catch((error) => {
			if (!(error instanceof APIError)) {
				error = new NetworkError(error.message, path)
			}
			logError(error);
			failures++;
		}
		);
	}
	return failures;
};