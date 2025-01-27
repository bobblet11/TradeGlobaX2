import "./summaryTable.css"
import { formatNumber } from "../../utils/format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAsc } from "@fortawesome/free-solid-svg-icons";
import { faSortDesc } from "@fortawesome/free-solid-svg-icons";
import PriceRange from "./priceRange";



export default function SummaryTable({coin, index}){
	const values = coin.priceInstances[0]
	const remainingValues = Object.keys(values)
	.filter(key=>!['price','percent_change_1h','percent_change_7d','percent_change_24h','timestamp'].includes(key))
	.reduce(
		(acc,key)=>{
			acc[key] = values[key]; return acc
		},{}
	);

	const arrow = values.percent_change_24h >= 0 ? faSortAsc : faSortDesc;
	const colour = values.percent_change_24h >= 0 ? "green" : "red"


	return (

		<div className="summary_container">

			<div className="price-container">

				<div>
					<div className="price-title">
						{coin.symbol} 
						<span className="index-symbol">
							{"#" + index}
						</span>
						{"'s  Price: "}
					</div>

					<div className="price">
						<span>

							{"$"+formatNumber(values.price)}
							</span>

							<span className={"arrow " + colour}>
							<FontAwesomeIcon
								icon={arrow}
								size="2x"
							/>
							{formatNumber(values.percent_change_24h) + "%"} 
						</span>
					</div>
			
				</div>

			</div>
			<div className="range">
				<PriceRange min={parseFloat(coin.dailyMin, 10)} value={parseFloat(values.price,10)} max={parseFloat(coin.dailyMax,10)} />
			</div>

			<ul>
				{Object.keys(remainingValues).map((key) => (
					<li key={key}>
						<div className="price-instance-pair">
							<div className="price-instance-key">
								{key.replaceAll("_"," ")}
							</div>

							<div className="price-instance-value">
								{remainingValues[key]>0  ?  "" : "- "}
								{['circulating_supply', 'total_supply'].includes(key) ?  "" : "$"}
								{remainingValues[key]>0  ?  formatNumber(remainingValues[key]) : formatNumber(-remainingValues[key])}
							</div>
						</div>
					</li> 
				))}
			</ul>

		</div>


	);
}