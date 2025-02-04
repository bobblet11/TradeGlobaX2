import * as manager from './manager.js'; // Ensure to add .js extension
import { db } from '../server.js';

export const authenticate = () => {
	return async (req, res, next) => {
		try {
			await manager.authenticateKey(db, req.headers['x-api-key'])
			next();
		} catch (error) {
			console.error(error)
			return res.status(401).json({ message: error.message });
		}
	};
}
