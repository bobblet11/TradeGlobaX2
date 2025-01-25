import "./summaryTable.css"
import { formatNumber } from "../../utils/format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAsc } from "@fortawesome/free-solid-svg-icons";
import { faSortDesc } from "@fortawesome/free-solid-svg-icons";
import PriceRange from "./priceRange";



export default function SummaryTable({coin}){
	const values = coin.priceInstances[0]
	const arrow = values.percent_change_24h >= 0 ? faSortAsc : faSortDesc;
	const colour = values.percent_change_24h >= 0 ? "green" : "red"

	

	return (

		<div className="summary_container">

			<div className="price-container">

				<div>
					<span className="price">
						{"$"+formatNumber(values.price)}
					</span>

					<span className={"arrow " + colour}>
						<FontAwesomeIcon
							icon={arrow}
							size="2x"
						/>
						{formatNumber(values.percent_change_24h) + " %"} 
					</span>
				</div>

			</div>
			<div className="range">
				<PriceRange min={parseFloat(coin.dailyMin, 10)} value={parseFloat(values.price,10)} max={parseFloat(coin.dailyMax,10)} />
			</div>

		</div>


	);
}