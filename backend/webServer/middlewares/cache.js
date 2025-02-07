import { log } from "../../logger.js";

export const cache = {}

const cacheIsExpired = (cacheEntry)=>{
	const now = new Date();
	const timeOfCacheEntry = new Date(cacheEntry.timeOfEntry);

	if (timeOfCacheEntry.getDate() !== now.getDate() || timeOfCacheEntry.getHours() !== now.getHours()){
		return true
	}

	return false
}


export const cacheCheck = () => {
	return async (req, res, next) => {

		const cacheEntry = cache[req.baseUrl + req.path];

		// No cache entry exists, proceed to the next middleware
		if (cacheEntry === undefined) {
		    log("Cache", `Cache miss for: ${req.baseUrl + req.path}`)
		    return next(); 
		}

		// Cache entry is expired, proceed to the next middleware
		if (cacheIsExpired(cacheEntry)) {
		    log("Cache", `Cache expired for: ${req.baseUrl + req.path}`)
		    return next(); 
		}
		
		// Cache exists and is valid. Skip over any Database queries.
		return res.status(200).send(cacheEntry.data); 
	};
}

export const updateCache = (req, dataToCache) => {
	const now = new Date();
	const cacheEntry = {
		'timeOfEntry' : now.toISOString(), 
		'data' : dataToCache
	};
	cache[req.baseUrl + req.path] = cacheEntry;
}