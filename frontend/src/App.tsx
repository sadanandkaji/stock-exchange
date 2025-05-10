// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { Topbar } from "./components/topbar"; // Import Topbar
import OrderForm from './components/OrderForm';
import BalanceViewer from './components/BalanceViewer';
import OrderBookChart from './components/orderbookchat';
import DepthBook from "./components/DepthBook";

// Pages
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center text-center px-6 pt-24">
      <h2 className="text-5xl font-extrabold text-blue-700 mb-4">Welcome to BETx</h2>
      <p className="text-gray-600 text-lg mb-6 max-w-2xl">
        Trade orders, view balances, and analyze market depth with ease.
      </p>
      <Link
               to="/order"
               
               className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold transition duration-300"
             >
               Start Trading
             </Link>
    </div>
  );
}

function OrderPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 pt-24">
      <OrderForm />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <OrderBookChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <DepthBook />
        </div>
      </div>
    </div>
  );
}

function BalancePage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen pt-24">
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto hover:shadow-lg transition">
        <BalanceViewer />
      </div>
    </div>
  );
}

function DepthPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen pt-24">
      <div className="bg-white rounded-xl shadow p-6 max-w-6xl mx-auto hover:shadow-lg transition">
        <DepthBook />
      </div>
    </div>
  );
}

// Main App
export default function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/depth" element={<DepthPage />} />
      </Routes>
    </Router>
  );
}
