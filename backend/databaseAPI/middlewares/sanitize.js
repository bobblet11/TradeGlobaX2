export const sanitise = () => {
	return (req, res, next) => {
	    const sanitizeInput = (data) => {
		if (typeof data === 'string') {
		    return data.trim(); // Trim whitespace from strings
		} else if (Array.isArray(data)) {
		    return data.map(sanitizeInput); // Recursively sanitize array elements
		} else if (typeof data === 'object' && data !== null) {
		    return Object.keys(data).reduce((acc, key) => {
			acc[key] = sanitizeInput(data[key]); // Recursively sanitize object properties
			return acc;
		    }, {});
		}
		return data; // Return as is for non-string, non-array, non-object types
	    };
    
	    if (req.body && Object.keys(req.body).length) {
		req.body = sanitizeInput(req.body); // Sanitize the request body
	    }
	    else {
		req.query = sanitizeInput(req.query); // Sanitize the query parameters
	    }
	    next();
	};
};