import express from 'express';
import { validate } from '../middlewares/validate.js';
import { sanitise } from '../middlewares/sanitize.js';
import { signUp, signIn } from '../auth/user.js';
import { USER_LOGIN_SCHEMA } from '../constants/schemas.js';
import { db } from "../server.js";

const router = express.Router();


router.post('/register', validate(USER_LOGIN_SCHEMA), sanitise(), async (req, res, next) => {
	//idk, add any other registration info here
	const { username, password } = req.body;
	try {
		await signUp(db, username, password);
		return res.status(200).end();
	} catch (error) {
		next(error);
	}
});


router.post('/login', validate(USER_LOGIN_SCHEMA), sanitise(), async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const token = await signIn(db, username, password);
		const data = {
			"user":{
				"username":username,
				"token":token,
			},
			"token":token,
		}
		return res.status(200).json(data);
	} catch (error) {
		next(error);
	}
});


router.post('/token/verify', sanitise(), async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		const error = new AuthError("No token found in headers", 401);
		return next(error);
	}


	if (!verifyJWTToken(token)) {
		const error = new AuthError("Token is invalid", 403);
		return next(error);
	}

	return res.status(200);
});

export default router;