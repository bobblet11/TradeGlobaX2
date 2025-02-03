import { APIError, NetworkError, FileError } from "./errorHandling.js";

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
	const errorDetails = {
		timestamp: new Date().toLocaleString('en-US', timeOptions),
		message: error.message,
		name: error.name,
		stack: error.stack || 'N/A',
	};

	if (error instanceof APIError) {
		errorDetails.statusCode = error.statusCode;
		errorDetails.response = error.response ? JSON.stringify(error.response, null, 2) : 'N/A';
	} else if (error instanceof NetworkError) {
		errorDetails.details = 'A network error occurred.';
	} else if (error instanceof FileError) {
		errorDetails.details = 'A file handling error occurred.';
	} else {
		errorDetails.details = 'An unknown error occurred.';
	}

	console.error('\n\n--- Error Details ---');
	console.error(`Timestamp: ${errorDetails.timestamp}`);
	console.error(`Name: ${errorDetails.name}`);
	console.error(`Message: ${errorDetails.message}`);
	console.error(`Status Code: ${errorDetails.statusCode || 'N/A'}`);
	console.error(`Response: ${errorDetails.response || 'N/A'}`);
	console.error(`Details: ${errorDetails.details || 'N/A'}`);
	console.error(`Stack Trace: ${errorDetails.stack}`);
	console.error('---------------------\n\n');
}