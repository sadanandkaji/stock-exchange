import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import type { ChartOptions } from "chart.js";

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Define types
interface Order {
  price: number;
  quantity: number;
}
interface MarketDepthResponse {
  depth: {
    bids: Order[];
    asks: Order[];
  };
}

// Maximum number of data points to keep in sliding window
const MAX_POINTS = 20;

const OrderBookChart = () => {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [bidVolumes, setBidVolumes] = useState<number[]>([]);
  const [askVolumes, setAskVolumes] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch market depth periodically
  useEffect(() => {
    fetchDepth(); // Initial fetch
    intervalRef.current = setInterval(fetchDepth, 5000); // Fetch every 5s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchDepth = async () => {
    try {
      const res = await axios.get<MarketDepthResponse>("http://localhost:3000/depth");
      const { bids, asks } = res.data.depth;

      const bidVolume = bids.reduce((sum, b) => sum + b.quantity, 0);
      const askVolume = asks.reduce((sum, a) => sum + a.quantity, 0);
      const currentTime = new Date().toLocaleTimeString();

      setTimestamps(prev => [...prev.slice(-MAX_POINTS + 1), currentTime]);
      setBidVolumes(prev => [...prev.slice(-MAX_POINTS + 1), bidVolume]);
      setAskVolumes(prev => [...prev.slice(-MAX_POINTS + 1), askVolume]);

      setError(null);
    } catch (err) {
      console.error("Error fetching depth:", err);
      setError("Failed to load market depth data.");
    }
  };

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Total Bids",
        data: bidVolumes,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Total Asks",
        data: askVolumes,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Live Market Depth Over Time",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Quantity",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">📊 Market Depth Over Time</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Line data={data} options={options} />
    </div>
  );
};

export default OrderBookChart;
