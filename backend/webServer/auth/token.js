import { AuthError } from "../errorHandling.js";
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
import jwt from "jsonwebtoken"
import { log } from "../logger.js";

export const generateJWTToken = (username) => {
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	const now = Math.floor(Date.now() / 1000); 
	const expiration = now + (24 * 60 * 60);

	const tokenData = {
		username,
		"iat": now,
		"exp": expiration
	};

	try {
		const token = jwt.sign(tokenData, jwtSecretKey);
		return token
	} catch (error) {
	    	console.error(new AuthError(`Failed to generate JWT: ${error.message}`));
		return null;
	}
}

//const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
//req.header(tokenHeaderKey)

export const verifyJWTToken = (token) => {   
	const jwtSecretKey = process.env.JWT_SECRET_KEY; 
	try {
		const tokenData = jwt.verify(token, jwtSecretKey);
		log("verifyJWT", tokenData);
		return tokenData;
	} catch (error) {
		console.error(new AuthError(`Failed to verify JWT: ${error.message}`));
		return null;
	    	
	}
}