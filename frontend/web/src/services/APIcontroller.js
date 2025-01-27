export async function getAllCoins(){
	const URL = import.meta.env.VITE_DATABASE_API_URL;
	const response = await fetch(URL+'/coin/all', {
		method:'GET',
	});
	const data = await response.json();
	const filteredData = data.filter(item => item.latestPriceInstance !== null);
	return filteredData
}

export async function getSpecificCoin(symbol){
	const URL = import.meta.env.VITE_DATABASE_API_URL;
	const response = await fetch(URL+'/coin?symbol='+symbol, {
		method:'GET',
	});
	const data = await response.json();
	return data
}

export async function getChartData(symbol, timeframe){

	const today = new Date()
	const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1))

	let start = null
	if (timeframe === "24h"){
		start = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0,0)) //start of day
	}else if (timeframe === "7d"){
		start = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()-7,0,0,0,0)) // 7 days ago to now
	}else if (timeframe === "30d"){
		start = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()-30,0,0,0,0)) // 30 days ag0
	}else if (timeframe === "Max"){ //all time
		start = new Date(0)
	}

	const URL = import.meta.env.VITE_DATABASE_API_URL;
	let response = await fetch(URL+`/coin/priceInstance/range?symbol=${symbol}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`, {
		method: 'GET'
	});
	response = await response.json();
	response = response.reverse();
	const timestamps = response.map(obj => (new Date(obj.timestamp).toUTCString()));
	const prices = response.map(obj => ( obj.price));

	const data = {
		labels: timestamps,
		datasets: [
		    {
		      label: '',
		      data: prices,
		      borderWidth: 1,
		    }
		]
	}

	return data
}