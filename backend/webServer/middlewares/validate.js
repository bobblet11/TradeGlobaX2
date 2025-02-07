import { errorHandler } from "./errorHandler.js";

export const validate = (schema) => {
	return (req, res, next) => {
		const dataToValidate = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;

		const { error } = schema.validate(dataToValidate);

		if (error) {
			return errorHandler(error);
		}

		return next();
	};
};


export const convertToString = () => {
	return (req, res, next) => {
		const dataToValidate = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;
		const fieldToValidate = req.body && Object.keys(req.body).length > 0 ? 'body' : 'query';

		const stringified = convertValuesToStrings(dataToValidate);
		req[fieldToValidate] = stringified;
		
		next();
	};
};


const convertValuesToStrings = (obj) => {
	
	// Convert non-objects to strings so REGEX can be applied by schema
	if (typeof obj !== 'object' || obj === null) {
		return String(obj);
	}

	// Convert nested objects to strings so REGEX can be applied by schema
	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = convertValuesToStrings(obj[key]);
		return acc;
	}, Array.isArray(obj) ? [] : {});
}