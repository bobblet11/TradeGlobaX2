import { logError } from "../../logger.js";

// Centralized error handler
export const errorHandler = (err, req, res, next) => {
	logError(err);
	const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
	const errorResponse = {
	    error: {
		code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
		message: err.message || 'An unexpected error occurred.',
		details: err.details || [],
	    },
	};
	return res.status(statusCode).json(errorResponse);
};
