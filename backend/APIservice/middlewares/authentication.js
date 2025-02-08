import * as manager from './manager.js'; // Ensure to add .js extension
import { db } from '../server.js';
import { AuthError } from '../../errorHandling.js';
import { verifyJWTToken } from '../auth/token.js';
import { logError } from '../../logger.js';
import { errorHandler } from './errorHandler.js';

export const authenticateDbAccess = () => {
	return async (req, res, next) => {
		try {
			await manager.authenticateKey(db, req.headers['x-api-key'])
			next();
		} catch (error) {
			errorHandler(error);
		}
	};
}

export const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		const error = new AuthError("No token found in headers", 401);
		return errorHandler(error);
	}

	if (!verifyJWTToken(token)) {
		const error = new AuthError("Invalid token", 403);
		return errorHandler(error);
	}

	next();
};