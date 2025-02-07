import { AuthError, DatabaseError } from "../errorHandling.js";
import { log } from "../logger.js";
import { generateJWTToken } from "./token.js";
import { createHashedPassword, comparePassword } from "./password.js";

export const signUp = async (db, user) => {
	if (await userExists(db, user.username)) {
		throw new DatabaseError("Cannot create new user because username already exists", "insertOne", "accounts");
	}
	const collection = db.collection("accounts");

	try {
		user.passwordHash = await createHashedPassword(user.passwordHash);
	}
	catch (error) {
		throw new DatabaseError("Cannot create new user because password hashing failed", "insertOne", "accounts");
	}

	const createUserResult = await collection.insertOne(user);
	log("create user", `successfully created new user ${createUserResult}`);
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

export const signIn = async (db, username, passwordHash) => {
	const user = await userExists(db, username);
	if (!user) {
		throw new DatabaseError("Cannot signIn user because account does not exists", "signIn", "accounts");
	}

	try {
		const match = await comparePassword(passwordHash, user.passwordHash);
		if (!match) {
			throw new AuthError("Password does not match!");
		}

		return generateJWTToken(username);
	}
	catch (error) {
		throw new DatabaseError("Cannot signIn user because password hashing failed", "signIn", "accounts");
	}

}

