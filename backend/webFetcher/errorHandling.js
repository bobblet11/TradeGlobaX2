// Custom Error Types
export class APIError extends Error {
	constructor(message, statusCode, response) {
		super(message);
		this.name = "APIError";
		this.statusCode = statusCode;
		this.response = response;
		this.details = `${this.name} : `
	}
}
      
export class NetworkError extends Error {
	constructor(message) {
		super(message);
		this.name = "NetworkError";
	}
}

export class FileError extends Error {
	constructor(message) {
		super(message);
		this.name = "FileError";
	}
}
