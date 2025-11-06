// /api/create-paypal-order.js
const { generateAccessToken, createOrder } = require('./lib/paypal');
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { items } = req.body;
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const accessToken = await generateAccessToken();
      const order = await createOrder(total, accessToken);
      res.status(200).json(order);
    } catch (err) {
      console.error("Error creating PayPal order:", err);
      res.status(500).json({ error: "Error creating PayPal order" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);