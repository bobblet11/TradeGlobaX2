import React, { createContext, useContext, useEffect, useState } from 'react';

const CoinContext = createContext();

export const useCoins = () => {
  return useContext(CoinContext);
};

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);

  const fetchCoins = async () => {
    try {
      const response = await fetch('http://localhost:3000/coin/all');
      const data = await response.json();
      const filteredData = data.filter(item => item.latestPriceInstance !== null);
      setCoins(filteredData); 
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  useEffect(() => {
    fetchCoins(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchCoins(); // Fetch coins every 10 seconds
    }, 5000); // 10000 milliseconds = 10 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, []);

  return (
    <CoinContext.Provider value={{ coins }}>
      {children}
    </CoinContext.Provider>
  );
};