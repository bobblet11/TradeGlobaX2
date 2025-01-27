import { useState, useEffect } from "react";
import SummaryTable from "../components/common/summaryTable";
import { getSpecificCoin, getChartData} from "../services/APIcontroller";
import "./coin.css";
import { useLocation, useParams } from "react-router-dom";
import PriceGraph from "../components/common/priceGraph";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);
function CoinPage() {
  const location = useLocation();
  const pathSections = location.pathname.split("/").filter(Boolean);
  const symbol = pathSections[pathSections.length - 1]; // Get the last section
  const index = pathSections[pathSections.length - 2]; // Get the last section

  const [coin, setCoin] = useState(null);
  const [timeframe, setTimeframe] = useState("24h")
  const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
		    {
		      label: '',
		      data: [],
		      borderWidth: 1,
		    }
		]
	})

  const fetchCoin = async () => {
    try {
      const fetchedCoin = await getSpecificCoin(symbol);
      setCoin(fetchedCoin);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  const fetchChart = async () => {
    try {
      const priceInstances = await getChartData(symbol,timeframe);
      setChartData(priceInstances);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchCoin(); // Initial fetch
    
    const intervalId = setInterval(() => {
      fetchCoin();
    }, 60000); // 10000 milliseconds = 10 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [symbol]);

  
  useEffect(() => {
    fetchChart(); // Initial fetch
    
    const intervalId = setInterval(() => {
      fetchChart();
    }, 60000); // 10000 milliseconds = 10 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [timeframe]);

  return (
    <main className="coin-background">
      {coin === null || chartData === null? (
        <p>Loading...</p>
      ) : (
        <>
          <header className="coin-header">
            <div>
              <div className="coin-title-name">{coin.name}</div>

              <div className="coin-title-symbol">{`( ${coin.symbol} )`}</div>
            </div>

            <img src={coin.logo}></img>
          </header>

          <div className ="coin-infos">
            <SummaryTable coin={coin} index={index} />
            <PriceGraph chartData={chartData} timeframe={timeframe} setTimeframe={setTimeframe}/>
          </div>
          <div className="coin-description">{coin.description}</div>
        </>
      )}
    </main>
  );
}

export default CoinPage;
