export function formatNumber(number){
	// Parse the number and round it to two decimal places
	const roundedNumber = Math.round((parseFloat(number) + Number.EPSILON) * 100) / 100;

	// Use toLocaleString to format the number with commas
	return roundedNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}