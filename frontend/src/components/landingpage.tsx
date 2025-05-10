// src/components/LandingPage.tsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold mb-4">Welcome to Mini Stock Exchange</h1>
      <p className="text-xl mb-6">
        Experience real-time stock trading, balance management, and live market data all in one place.
      </p>
      <div className="flex gap-6">
        <Link
          to="/order"
          
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold transition duration-300"
        >
          Start Trading
        </Link>
        <Link
          to="/balance"
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg text-xl font-semibold transition duration-300"
        >
          View Balance
        </Link>
      </div>
    </div>
  );
}
