import "./paginator.css"
export default function Paginator({currentPage, numberOfPages, onPageChange}) {	
	const handlePrev = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};
	
	const handleNext = () => {
		if (currentPage < numberOfPages) {
			onPageChange(currentPage + 1);
		}
	};

	return (
		<div className="container">
			<button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
			<div>Page {currentPage} of {numberOfPages}</div>
			<button onClick={handleNext} disabled={currentPage === numberOfPages}>Next</button>
		</div>
	);
}
