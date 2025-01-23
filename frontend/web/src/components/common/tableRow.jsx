import "./tableRow.css";
import { formatNumber } from "../../utils/format";
import { Link } from "react-router-dom";

export default function TableRow({ index, coin }) {
  return (
	<tr>
		<td>{index}</td>
		<td>
			<Link to={`/coins/${coin.symbol}`}>
				<div className="image-symbol-pair">
					<img className="image" src={coin.logo}></img>
					<div className="symbol">
						{coin.symbol}
					</div>
				</div>
			</Link>
		</td>
		<td>{"$" + formatNumber(coin.latestPriceInstance.price)}</td>
		<td>{formatNumber(coin.latestPriceInstance.percent_change_1h) + "%"}</td>
		<td>{formatNumber(coin.latestPriceInstance.percent_change_24h) + "%"}</td>
		<td>{formatNumber(coin.latestPriceInstance.percent_change_7d) + "%"}</td>
		<td>{formatNumber(coin.latestPriceInstance.volume_change_24h)}</td>
		<td>{"$" + formatNumber(coin.latestPriceInstance.market_cap)}</td>
	</tr>
  );
}


