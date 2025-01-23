import { useState, useEffect } from 'react';
import { useCoins } from '../../contexts/coinContext';
import Paginator from './paginator';
import Table from './table';

const MAX_COINS_PER_PAGE = 100

export default function CoinViewer() {
	const {coins} = useCoins()
	const numberOfCoins = coins.length;
	const numberOfPages = Math.ceil(numberOfCoins / MAX_COINS_PER_PAGE);
	const [currentPage, setCurrentPage] = useState(1);

	// Calculate the start and end indices based on the current page
	const start = (currentPage - 1) * MAX_COINS_PER_PAGE;
	const end = start + MAX_COINS_PER_PAGE;

	// Get the paginated coins
	const paginatedCoins = coins.slice(start, end);

	// Handle page change
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (   
		<>
			<Table coins={paginatedCoins} coinsPerPage={MAX_COINS_PER_PAGE} currentPage={currentPage}/>
			<Paginator currentPage={currentPage} numberOfPages={numberOfPages} onPageChange={handlePageChange}/>
		</>
	);
}
