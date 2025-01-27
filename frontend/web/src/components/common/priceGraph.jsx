import Chart from "chart.js/auto";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import "./priceGraph.css"

export default function PriceGraph({chartData, timeframe, setTimeframe}){
	const [activeButton, setActiveButton] = useState('24h'); // Default active button

	const handleButtonClick = (timeframe) => {
	    setActiveButton(timeframe); // Set the active button
	    setTimeframe(timeframe)
	};

	return (
		<div className="chart-container">
			<Line
				data={chartData}
				options={{
					plugins: {
						title: {
							display: true,
							text: "Price over " + timeframe
						},
						legend: {
							display: false
						}
					},
					scales: {
						x: {
						    display: false, // Hide x-axis labels
						}
					    }
				}}
			/>

			<div className="timeframe-buttons-container">
				{['24h', '7d', '30d', 'Max'].map((timeframe) => (
					<button
						key={timeframe}
						onClick={() => handleButtonClick(timeframe)}
						className={activeButton === timeframe ? 'active' : ''}
						>
					{timeframe}
					</button>
				))}
			</div>
		</div>

	);
}