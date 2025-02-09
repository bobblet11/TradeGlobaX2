import { AuthError } from "../../errorHandling.js";
import { TOKEN_HEADER_KEY, JWT_SECRET_KEY } from "../config.js";
import jwt from "jsonwebtoken"
import { log, logError } from "../../logger.js";

export const generateJWTToken = (username) => {
	const jwtSecretKey = JWT_SECRET_KEY;
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
		logError(new AuthError(`Failed to generate JWT: ${error.message}`));
		return null;
	}
}



export const verifyJWTToken = (token) => {
	const jwtSecretKey = JWT_SECRET_KEY;
	try {
		const tokenData = jwt.verify(token, jwtSecretKey);
		log("verifyJWT", tokenData);
		return tokenData;
	} catch (error) {
		logError(new AuthError(`Failed to verify JWT: ${error.message}`));
		return null;

	}
}