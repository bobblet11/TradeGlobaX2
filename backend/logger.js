import { TemplateError } from "./errorHandling.js";

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

	if (error instanceof TemplateError) {
		error.print(timestamp);
	} else {
		console.error('\n\n--- Unknown Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${error.message}`);
		console.error(`Stack Trace: ${error.stack || 'N/A'}`);
	}
	console.error('---------------------\n\n');
}