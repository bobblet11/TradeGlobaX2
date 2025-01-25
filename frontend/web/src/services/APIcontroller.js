export async function getAllCoins(){
	const URL = import.meta.env.VITE_DATABASE_API_URL;
	const response = await fetch(URL+'/coin/all');
	const data = await response.json();
	const filteredData = data.filter(item => item.latestPriceInstance !== null);
	return filteredData
}

export async function getSpecificCoin(symbol){
	const URL = import.meta.env.VITE_DATABASE_API_URL;
	const response = await fetch(URL+'/coin?symbol='+symbol);
	const data = await response.json();
	return data
}