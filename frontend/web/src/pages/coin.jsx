import { useState, useEffect } from "react";
import SummaryTable from "../components/common/summaryTable";
import { getSpecificCoin } from "../services/APIcontroller";
import { useLocation, useParams } from "react-router-dom";

function CoinPage() {
  const location = useLocation();
  const pathSections = location.pathname.split("/").filter(Boolean);
  const symbol = pathSections[pathSections.length - 1]; // Get the last section

  const [coin, setCoin] = useState(null);

  const fetchCoin = async () => {
    try {
      const fetchedCoin = await getSpecificCoin(symbol);
      setCoin(fetchedCoin);
    } catch (error) {
      console.error("Error fetching coins:", error);
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

  return (
    <div>
      Coin
      {coin === null ? (
         <p>Loading...</p>  
      ) : (
        <SummaryTable coin={coin} /> // Render SummaryTable if coin is not empty
      )}
    </div>
  );
}

export default CoinPage;
