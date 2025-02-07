// Custom Error Types

export class TemplateError extends Error {
	constructor(message) {
		super(message);
	}
}

export class APIError extends TemplateError {
	constructor(message, statusCode, response, url, body, method) {
		super(message);
		this.name = "APIError";
		this.statusCode = statusCode;
		this.response = response;
		this.url = url;
		this.body = body;
		this.method = method
	}

	print(timestamp) {
		console.error('\n\n--- API Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Name: ${this.name}`);
		console.error(`Message: ${this.message}`);
		console.error(`Status Code: ${this.statusCode || 'N/A'}`);
		console.error(`Method: ${this.method}`);
		console.error(`URL: ${this.url}`);
		console.error(`Body: ${JSON.stringify(this.body)}`);
		console.error(`Response: ${this.response ? JSON.stringify(this.response, null, 2) : 'N/A'}`);
		console.error(`Stack Trace: ${this.stack || 'N/A'}`);
	}
}

export class NetworkError extends TemplateError {
	constructor(message, url = "N/A") {
		super(message);
		this.name = "NetworkError";
		this.url = url;
	}

	print(timestamp) {
		console.error('\n\n--- Network Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Attempted Fetch URL: ${this.url}`);
		console.error(`Message: ${this.message}`);
		console.error(`Stack Trace: ${this.stack || 'N/A'}`);
	}
}

export class FileError extends TemplateError {
	constructor(message) {
		super(message);
		this.name = "FileError";
	}

	print(timestamp) {
		console.error('\n\n--- File Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${this.message}`);
		console.error(`Stack Trace: ${this.stack || 'N/A'}`);
	}
}

export class DatabaseError extends TemplateError {
	constructor(message, operation = "N/A", collection = "N/A") {
		super(message);
		this.name = "Database Error";
		this.operation = operation;
		this.collection = collection
	}

	print(timestamp) {
		console.error('\n\n--- Database Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${this.message}`);
		console.error(`Operation: ${this.operation}`);
		console.error(`Collection Accessed: ${this.collection}`);
		console.error(`Stack Trace: ${this.stack || 'N/A'}`);
	}
}

export class AuthError extends TemplateError {
	constructor(message) {
		super(message);
		this.name = "Auth Error";
	}

	print(timestamp) {
		console.error('\n\n--- Auth Error Occurred ---');
		console.error(`Timestamp: ${timestamp}`);
		console.error(`Message: ${this.message}`);
		console.error(`Stack Trace: ${this.stack || 'N/A'}`);
	}
}

