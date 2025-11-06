// /api/stripe-session.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query; 
      const session = await stripe.checkout.sessions.retrieve(id, {
        expand: ["customer", "payment_intent"],
      });

      res.status(200).json({
        orderId: session.id,
        status: session.payment_status,
        email: session.customer_details?.email,
        date: new Date(),
        total: session.amount_total / 100,
        paymentMethod: "Carta di Credito"
      });
    } catch (err) {
      console.error("Error recuperando sesión Stripe:", err);
      res.status(500).json({ error: "Error recuperando sesión Stripe" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);