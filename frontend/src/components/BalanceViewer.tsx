import { useState } from 'react';
import axios from 'axios';

export default function BalanceViewer() {
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  // Function to fetch balance data from the backend
  const fetchBalance = async () => {
    if (!userId) {
      alert('Please enter a user ID');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get<{ balances: { [key: string]: number } }>(
        `http://localhost:3000/balance/${userId}`
      );
      console.log('Fetched balance:', res.data.balances);
      setBalance(res.data.balances);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">💰 Balance Viewer</h2>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
        className="border px-3 py-2 rounded w-full mb-3"
      />
      <button
        onClick={fetchBalance}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Loading...' : 'Get Balance'}
      </button>

      {/* Displaying Balance Data */}
      <div className="text-lg space-y-2">
        {balance ? (
          <>
            <div className="flex justify-between">
              <strong>GOOGLE:</strong>
              <span>{balance['GOOGLE'] ?? 0} Stocks</span>
            </div>
            <div className="flex justify-between">
              <strong>RS:</strong>
              <span>₹{balance['RS'] ?? 0}</span>
            </div>
          </>
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
}
