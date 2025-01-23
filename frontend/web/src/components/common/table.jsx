import "./table.css"
import { useCoins } from '../../contexts/coinContext';
import TableRow from "./tableRow";

export default function Table({coins, currentPage, coinsPerPage}) {
  	return (
		<article className="table-container">
			<table>
				<thead>
					<tr>
						<th className="index-th">#</th>
						<th className="name-th">Symbol</th>
						<th className="price-th">Price</th>
						<th className="hr-th">1h</th>
						<th className="tf-hr-th">24h</th>
						<th className="sd-th">7d</th>
						<th className="tf-hr-vol-th">24h Volume</th>
						<th className="marketcap-th">Market Cap</th>
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
