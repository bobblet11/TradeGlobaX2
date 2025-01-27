import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css"
import HomePage from "./pages/home";
import NotFoundPage from "./pages/notFound";
import CoinPage from "./pages/coin";
import { CoinProvider } from './contexts/coinContext';
import SiteHeader from "./components/common/siteHeader";

function App() {
  return (
    <div>
      <SiteHeader/>
      <CoinProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/coins/:index/:coin" element={<CoinPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CoinProvider>
    </div>
  );
}

export default App;
