export const cache = {}

export const cacheCheck = () => {

	const cacheIsExpired = (cacheEntry)=>{
		//since the fetcher adds new data every hour, need to check if the hour is different
		const now = new Date();
		const timeAdded = new Date(cacheEntry.timeAdded);
		if (timeAdded.getDate() !== now.getDate()){
			return true
		}
		if (now.getHours() !== timeAdded.getHours()){
			return true
		}
		//date is same, and hour has not run over
		return false

	}


	return async (req, res, next) => {
		const cacheEntry = cache[req.baseUrl + req.path];
		console.log(Object.keys(cache))
		if (cacheEntry === undefined) {
		    console.log('Cache miss for:', req.baseUrl + req.path);
		    return next(); // No cache entry, proceed to the next middleware
		}

		if (cacheIsExpired(cacheEntry)) {
		    console.log('Cache expired for:', req.baseUrl + req.path);
		    return next(); // Cache is expired, proceed to the next middleware
		}
	
		return res.status(200).send(cacheEntry.data); // Serve cached data
	    };
}

export const updateCache = (req, dataToCache) => {
	const now = new Date();
	const cacheEntry = {'timeAdded':now.toISOString(), 'data':dataToCache};
	cache[req.baseUrl + req.path] = cacheEntry;
}