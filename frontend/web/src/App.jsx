import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css"
import HomePage from "./pages/home";
import NotFoundPage from "./pages/notFound";
import CoinPage from "./pages/coin";
import LoginPage from "./pages/loginPage";
import { CoinProvider } from './contexts/coinContext';
import { AuthProvider } from './contexts/authContext'; // Import AuthProvider
import SiteHeader from "./components/common/siteHeader";

function App() {
  return (
    <div>
      <SiteHeader />
      <AuthProvider> {/* Wrap your application with AuthProvider */}
        <CoinProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" exact element={<HomePage />} />
              <Route path="/coins/:index/:coin" element={<CoinPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </CoinProvider>
      </AuthProvider>
    </div>
  );
}

export default App;