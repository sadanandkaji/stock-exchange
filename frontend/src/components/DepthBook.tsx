import { useEffect, useState } from 'react';
import axios from 'axios';

type OrderEntry = {
  price: number | string;
  quantity: number;
  stock?: string;
};

type DepthData = {
  depth: {
    bids: OrderEntry[];
    asks: OrderEntry[];
  };
};

export default function DepthBook() {
  const [depth, setDepth] = useState<{ bids: OrderEntry[]; asks: OrderEntry[] }>({
    bids: [],
    asks: [],
  });

  useEffect(() => {
    fetchDepth();
  }, []);

  const fetchDepth = async () => {
    try {
      const res = await axios.get<DepthData>('http://localhost:3000/depth');
      console.log('Market Depth:', res.data.depth);
      setDepth(res.data.depth || { bids: [], asks: [] });
    } catch (err) {
      console.error('Error fetching depth:', err);
    }
  };

  const padOrders = (orders: OrderEntry[], type: 'bid' | 'ask'): OrderEntry[] => {
    const sorted = [...orders].sort((a, b) =>
      type === 'bid'
        ? Number(b.price) - Number(a.price)
        : Number(a.price) - Number(b.price)
    );

    while (sorted.length < 10) {
      sorted.push({ price: '--', quantity: 0, stock: 'GOOGLE' });
    }

    return sorted;
  };

  const paddedBids = padOrders(depth.bids, 'bid');
  const paddedAsks = padOrders(depth.asks, 'ask');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">📊 Market Depth</h2>
      <button
        onClick={fetchDepth}
        className="mb-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Refresh
      </button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2 text-blue-600">Buy Orders (Bids)</h3>
          {paddedBids.map(({ price, quantity, stock }, idx) => (
            <div key={idx} className="text-sm">
              {stock ?? 'GOOGLE'}: ₹{price} - Qty: {quantity}
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 text-red-600">Sell Orders (Asks)</h3>
          {paddedAsks.map(({ price, quantity, stock }, idx) => (
            <div key={idx} className="text-sm">
              {stock ?? 'GOOGLE'}: ₹{price} - Qty: {quantity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
