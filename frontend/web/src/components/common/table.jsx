import "./table.css"
import { useCoins } from '../../contexts/coinProvider';
import TableRow from "./tableRow";

export default function Table({coins, sortBy, currentPage, coinsPerPage}) {

  	return (
		<article className="table-container">
			<table>
				<thead className="table-header">
					<tr>
					<th className="index-th">
						#
					</th>	
					<th className="name-th">
						<button onClick={() => sortBy("symbol")}>
						Symbol
						</button>
					</th>
					<th className="price-th">
						<button onClick={() => sortBy("latestPriceInstance.price")}>
						Price
						</button>
					</th>
					<th className="hr-th">
						<button onClick={() => sortBy("latestPriceInstance.percent_change_1h")}>
						1h
						</button>
					</th>
					<th className="tf-hr-th">
						<button onClick={() => sortBy("latestPriceInstance.percent_change_24h")}>
						24h
						</button>
					</th>
					<th className="sd-th">
						<button onClick={() => sortBy("latestPriceInstance.percent_change_7d")}>
						7d
						</button>
					</th>
					<th className="tf-hr-vol-th">
						<button onClick={() => sortBy("latestPriceInstance.volume_change_24h")}>
						24h Volume
						</button>
					</th>
					<th className="marketcap-th">
						<button onClick={() => sortBy("latestPriceInstance.market_cap")}>
						Market Cap
						</button>
					</th>
					</tr>
				</thead>

				<tbody>
					{coins.map((coin, index) => (
						<TableRow key={index} index={(index+1+(currentPage-1)*coinsPerPage)} coin={coin} />
					))}
				</tbody>
		
			</table>
		</article>
  	);
}
