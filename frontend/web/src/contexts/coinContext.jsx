import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllCoins } from '../services/APIcontroller';

const CoinContext = createContext();

export const useCoins = () => {
  return useContext(CoinContext);
};

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);

  const fetchCoins = async () => {
    try {
      const coins = await getAllCoins()
      coins.sort((a, b) => b.latestPriceInstance.market_cap - a.latestPriceInstance.market_cap);
      setCoins(coins); 
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  useEffect(() => {
    fetchCoins(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchCoins(); // Fetch coins every 10 seconds
    }, 60000); // 10000 milliseconds = 10 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, []);

  return (
    <CoinContext.Provider value={{ coins, setCoins}}>
      {children}
    </CoinContext.Provider>
  );
};