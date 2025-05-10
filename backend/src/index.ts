import express, { Request, Response } from "express";
import cors from "cors"; // ✅ Import CORS


const app = express();
app.use(cors()); // ✅ Enable CORS
app.use(express.json());

const TICKER = "GOOGLE";

type OrderSide = "bid" | "ask";

interface Balance {
  [key: string]: number;
}

interface User {
  id: string;
  balance: Balance;
}

interface Order {
  userid: string;
  price: number;
  quantity: number;
}

const users: User[] = [
  {
    id: "1",
    balance: {
      GOOGLE: 500,
      RS: 10000,
    },
  },
  {
    id: "2",
    balance: {
      GOOGLE: 10,
      RS: 5000,
    },
  },
];

const bids: Order[] = [];
const asks: Order[] = [];

// POST /order
//@ts-ignore
app.post("/order", (req: Request, res: Response) => {
  const { userid, price, quantity, side }: { userid: string; price: number; quantity: number; side: OrderSide } = req.body;

  let remainingQuantity = fillOrders(side, price, quantity, userid);

  if (remainingQuantity === 0) {
    return res.json({ filledQuantity: quantity });
  }

  const order: Order = { userid, price, quantity: remainingQuantity };

  if (side === "bid") {
    bids.push(order);
    bids.sort((a, b) => b.price - a.price); // Descending for bids
  } else {
    asks.push(order);
    asks.sort((a, b) => a.price - b.price); // Ascending for asks
  }

  return res.json({ filledQuantity: quantity - remainingQuantity });
});

// GET /depth
//@ts-ignore
app.get("/depth", (req: Request, res: Response) => {
  const depth = {
    bids: [] as { price: number; quantity: number; stock: string }[],
    asks: [] as { price: number; quantity: number; stock: string }[],
  };

  for (const order of bids) {
    const existing = depth.bids.find((d) => d.price === order.price);
    if (existing) {
      existing.quantity += order.quantity;
    } else {
      depth.bids.push({ price: order.price, quantity: order.quantity, stock: TICKER });
    }
  }

  for (const order of asks) {
    const existing = depth.asks.find((d) => d.price === order.price);
    if (existing) {
      existing.quantity += order.quantity;
    } else {
      depth.asks.push({ price: order.price, quantity: order.quantity, stock: TICKER });
    }
  }

  return res.json({ depth });
});






// GET /balance/:userid
//@ts-ignore
app.get("/balance/:userid", (req: Request, res: Response) => {
  const userid = req.params.userid;
  const user = users.find((u) => u.id === userid);

  if (!user) {
    return res.json({
      RS: 0,
      [TICKER]: 0,
    });
  }

  return res.json({ balances: user.balance });
});

// Core logic

function flipMoney(sellerId: string, buyerId: string, price: number, quantity: number) {
  const seller = users.find((u) => u.id === sellerId);
  const buyer = users.find((u) => u.id === buyerId);

  if (!seller || !buyer) return;

  // Transfer GOOGLE
  seller.balance[TICKER] -= quantity;
  buyer.balance[TICKER] += quantity;

  // Transfer RS
  seller.balance["RS"] += price * quantity;
  buyer.balance["RS"] -= price * quantity;
}

function fillOrders(side: OrderSide, price: number, quantity: number, userid: string): number {
  let remaining = quantity;

  if (side === "bid") {
    for (let i = 0; i < asks.length && remaining > 0;) {
      const ask = asks[i];
      if (ask.price > price) break;

      const fillQty = Math.min(remaining, ask.quantity);
      flipMoney(ask.userid, userid, ask.price, fillQty);

      ask.quantity -= fillQty;
      remaining -= fillQty;

      if (ask.quantity === 0) {
        asks.splice(i, 1);
      } else {
        i++;
      }
    }
  } else {
    for (let i = 0; i < bids.length && remaining > 0;) {
      const bid = bids[i];
      if (bid.price < price) break;

      const fillQty = Math.min(remaining, bid.quantity);
      flipMoney(userid, bid.userid, bid.price, fillQty);

      bid.quantity -= fillQty;
      remaining -= fillQty;

      if (bid.quantity === 0) {
        bids.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  return remaining;
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Exchange server running on http://localhost:${PORT}`);
});
