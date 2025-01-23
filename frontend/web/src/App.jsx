import { Route, Routes, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/home";
import NotFoundPage from "./pages/notFound";
import CoinPage from "./pages/coin";
import { CoinProvider } from './contexts/coinContext';

function App() {
  return (
    <div>
      <CoinProvider>
        <BrowserRouter>
          <h1>TradeGlobaX</h1>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/coins/:coin" element={<CoinPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CoinProvider>
    </div>
  );
}

export default App;
