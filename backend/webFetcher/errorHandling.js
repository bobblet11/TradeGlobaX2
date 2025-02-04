// Custom Error Types
export class APIError extends Error {
	constructor(message, statusCode, response, url, body, method) {
		super(message);
		this.name = "APIError";
		this.statusCode = statusCode;
		this.response = response;
		this.url = url;
		this.body = body;
		this.method = method
	}
}
      
export class NetworkError extends Error {
	constructor(message, url="N/A") {
		super(message);
		this.name = "NetworkError";
		this.url = url;
	}
}

export class FileError extends Error {
	constructor(message) {
		super(message);
		this.name = "FileError";
	}
}
