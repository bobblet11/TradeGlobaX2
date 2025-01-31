// Centralized error handler
export const errorHandler = (err, req, res, next) => {
	return res.status(800).send({
		error: {
			message: err,
		},
	});
};
