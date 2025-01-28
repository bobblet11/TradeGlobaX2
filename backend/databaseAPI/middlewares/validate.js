export const validate = (schema) => {
	return (req, res, next) => {

		const dataToValidate = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;

		const { error } = schema.validate(dataToValidate);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		next();
	};
};