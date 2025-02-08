import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css"
import HomePage from "./pages/home";
import NotFoundPage from "./pages/notFound";
import CoinPage from "./pages/coin";
import Login from "./pages/login";
import Register from "./pages/register";
import { CoinProvider } from './contexts/coinProvider';
import { AuthProvider } from './contexts/authProvider'; // Import AuthProvider
import SiteHeader from "./components/common/siteHeader";

//if we need any private pages hidden behind login 
          {/* <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route> */}

function App() {
  return (
    <div className="root">
      <SiteHeader />
      <AuthProvider> {/* Wrap your application with AuthProvider */}
        <CoinProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/register" element={<Register />} />

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