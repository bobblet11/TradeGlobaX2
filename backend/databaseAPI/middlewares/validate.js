export const validate = (schema) => {
	return (req, res, next) => {

		const dataToValidate = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;

		const { error } = schema.validate(dataToValidate);
		if (error) {
			console.log(dataToValidate)
			console.log(error.details.map(detail => detail.message) )// Send error messages)
			return res.status(900).json({ message: error });
		}
		next();
	};
};

function convertValuesToStrings(obj) {
	if (typeof obj !== 'object' || obj === null) {
		return String(obj); // Convert non-object values to string
	}

	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = convertValuesToStrings(obj[key]); // Recursively convert values
		return acc;
	}, Array.isArray(obj) ? [] : {}); // Preserve the array or object structure
}

export const makeString = () => {
	return (req, res, next) => {
		const dataToValidate = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;
		const fieldToValidate = req.body && Object.keys(req.body).length > 0 ? 'body' : 'query';

		const stringified = convertValuesToStrings(dataToValidate)
		req[fieldToValidate] = stringified
		
		next();
	};
};
