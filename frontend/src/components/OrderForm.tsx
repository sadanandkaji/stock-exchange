import React, { useState } from 'react';
import axios from 'axios';

interface OrderResponse {
  filledQuantity: number;
}

export default function OrderForm() {
  const [form, setForm] = useState({ userid: '1', price: 100, quantity: 1, side: 'bid' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    try {
      const res = await axios.post<OrderResponse>('http://localhost:3000/order', {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });

      alert(`Filled Quantity: ${res.data.filledQuantity}`);
    } catch (err) {
      alert('Error placing order');
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md text-sm max-w-sm">
      <h2 className="text-lg font-semibold mb-3">📝 Place Order</h2>
      <div className="space-y-3">
        <div>
          <label className="block mb-1">User ID</label>
          <input
            name="userid"
            value={form.userid}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Side</label>
          <select
            name="side"
            value={form.side}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          >
            <option value="bid">Buy</option>
            <option value="ask">Sell</option>
          </select>
        </div>
        <button
          onClick={placeOrder}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}
