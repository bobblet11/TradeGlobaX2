import { APIError, NetworkError, FileError, DatabaseError } from "./errorHandling.js";

const timeOptions = {
	timeZone: 'Asia/Hong_Kong',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false // Set to true for 12-hour format
};

export const log = (name, message) => {
	const timestamp = new Date().toLocaleString('en-US', timeOptions);
	console.log(`At ${timestamp} : ${name} : ${message}`);
}

export const logError = (error) => {
	const timestamp = new Date().toLocaleString('en-US', timeOptions)

	if (error instanceof APIError) {
		console.error('\n\n--- API Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Name: ${error.name}`);
		console.error(`Message: ${error.message}`);
		console.error(`Status Code: ${error.statusCode || 'N/A'}`);
		console.error(`Method: ${error.method}`);
		console.error(`URL: ${error.url}`);
		console.error(`Body: ${JSON.stringify(error.body)}`);
		console.error(`Response: ${error.response ? JSON.stringify(error.response, null, 2) : 'N/A'}`);
		console.error(`Stack Trace: ${error.stack || 'N/A'}`);
	} else if (error instanceof NetworkError) {
		console.error('\n\n--- Network Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Attempted Fetch URL: ${error.url}`);
		console.error(`Message: ${error.message}`);
		console.error(`Stack Trace: ${error.stack || 'N/A'}`);
	} else if (error instanceof FileError) {
		console.error('\n\n--- File Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${error.message}`);
		console.error(`Stack Trace: ${error.stack || 'N/A'}`);
	} else if (error instanceof DatabaseError) {
		console.error('\n\n--- Database Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${error.message}`);
		console.error(`Operation: ${error.operation}`);
		console.error(`Collection Accessed: ${error.collection}`);
		console.error(`Stack Trace: ${error.stack || 'N/A'}`);
	} else {
		console.error('\n\n--- Unknown Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${error.message}`);
		console.error(`Stack Trace: ${error.stack || 'N/A'}`);
	}
	console.error('---------------------\n\n');
}