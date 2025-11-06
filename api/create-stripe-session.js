// /api/create-stripe-session.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

      const lineItems = items.map(item => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
      
      const origin = req.headers.origin || 'http://localhost:3000';
      const successUrl = `${origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/index.html`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      res.status(200).json({ url: session.url, id: session.id });
    } catch (err) {
      console.error("Error creando sesión Stripe:", err);
      res.status(500).json({ error: "Error creando sesión Stripe" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);