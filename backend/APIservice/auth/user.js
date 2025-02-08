import { AuthError, DatabaseError } from "../../errorHandling.js";
import { log } from "../../logger.js";
import { generateJWTToken } from "./token.js";
import { createHashedPassword, comparePassword } from "./password.js";

export const signUp = async (db, username, password) => {
	if (await userExists(db, username)) {
		throw new DatabaseError("Cannot create new user because username already exists", "insertOne", "accounts");
	}
	const collection = db.collection("accounts");

	try {
		const hashPassword = await createHashedPassword(password);
		const insert = {"username":username, "passwordHash":hashPassword.hashedPassword}
		const createUserResult = await collection.insertOne(insert);
		log("create user", `successfully created new user ${createUserResult}`);
	}
	catch (error) {
		throw new DatabaseError("Cannot create new user", "insertOne", "accounts");
	}
}

export const deleteUser = async (db, username) => {
	if (!await userExists(db, username)) {
		throw new DatabaseError("Cannot delete user because username already exists", "deleteOne", "accounts");
	}
	const collection = db.collection("accounts");
	const deleteUserResult = await collection.deleteOne(username);
	log("delete user", `successfully deleted user ${deleteUserResult}`);
}

export const userExists = async (db, username) => {
	const collection = db.collection("accounts");
	const existingUser = await collection.findOne({ username });
	return existingUser;
}

export const signIn = async (db, username, password) => {
	const userInDb = await userExists(db, username);
	if (!userInDb) {
		throw new DatabaseError("Cannot signIn user because account does not exists", "signIn", "accounts");
	}

	const match = await comparePassword(String(password), String(userInDb.passwordHash));
	if (!match) {
		throw new AuthError("Password does not match!");
	}

	const token = generateJWTToken(username);
	if (!token){
		throw new AuthError("Failed to generate token");
	}
	return token
}

