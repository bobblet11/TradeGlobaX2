import * as manager from '../manager.js'; // Ensure to add .js extension
import { db } from '../server.js';

export const authenticate = () => {
	return async (req, res, next) => {
		try{
			await manager.authenticateKey(db, req.headers['x-api-key'])
			next();
		}catch(error){
			console.error(error)
			return res.status(401).json({ message: error.message });
		}
	};
}

const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
    
	if (!token) {
		console.error(new AuthError("No token found in headers"))
	    	return res.sendStatus(401);
	}

	if (!verifyJWTToken(token)){
		return res.sendStatus(403);
	}

	next();
};