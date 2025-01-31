import { useState } from 'react';
import { useCoins } from '../../contexts/coinContext';
import Paginator from './paginator';
import Table from './table';

const MAX_COINS_PER_PAGE = 100

function getNestedValue(obj, path) {
	return path.split('.').reduce((currentObject, key) => {
	    return currentObject ? currentObject[key] : undefined;
	}, obj);
}

export default function CoinViewer() {
	const {coins, setCoins} = useCoins()

	
	const sortBy = (field, sortDirection='dsc') => {
		const sorted = [...coins].sort((a, b) => {
			const valueA = getNestedValue(a, field);
			const valueB = getNestedValue(b, field);
			
			// Convert string values to numbers if they are numeric
			const numA = isNaN(valueA) ? valueA : Number(valueA);
			const numB = isNaN(valueB) ? valueB : Number(valueB);
			
			if (typeof numA === 'number' && typeof numB === 'number') {
			    return sortDirection === 'asc' ? numA - numB : numB - numA; // Toggle based on direction
			} else {
			    return sortDirection === 'asc' 
				? String(valueA).localeCompare(String(valueB)) 
				: String(valueB).localeCompare(String(valueA));
			}
		    });
	
		setCoins(sorted); // Update state with the new sorted array
	};

	const numberOfCoins = coins.length;
	const numberOfPages = Math.ceil(numberOfCoins / MAX_COINS_PER_PAGE);
	const [currentPage, setCurrentPage] = useState(1);

	// Calculate the start and end indices based on the current page
	const start = (currentPage - 1) * MAX_COINS_PER_PAGE;
	const end = start + MAX_COINS_PER_PAGE;	

	// Handle page change
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (   
		<>
			<Table coins={coins.slice(start,end)} sortBy={sortBy} coinsPerPage={MAX_COINS_PER_PAGE} currentPage={currentPage}/>
			<Paginator currentPage={currentPage} numberOfPages={numberOfPages} onPageChange={handlePageChange}/>
		</>
	);
}
