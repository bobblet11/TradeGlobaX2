// Centralized error handler
export const errorHandler = (err, req, res, next) => {
	console.error(err)
	return res.status(800).send({
		error: {
			message: err,
		},
	});
};
