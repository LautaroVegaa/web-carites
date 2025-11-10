// /api/stripe-session.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "session_id mancante" });
      }

      // 🔹 Obtener la sesión completa de Stripe
      const session = await stripe.checkout.sessions.retrieve(id, {
        expand: ["payment_intent.payment_method"],
      });

      // 🔹 Obtener detalles más precisos del pago
      const paymentIntent = session.payment_intent;
      const paymentMethod = paymentIntent?.payment_method?.card?.brand || "Carta di Credito";
      const last4 = paymentIntent?.payment_method?.card?.last4
        ? `•••• ${paymentIntent.payment_method.card.last4}`
        : "";

      // 🔹 Normalización precisa del estado
      const rawStatus = session.payment_status;
      const normalizedStatus =
        rawStatus === "paid"
          ? "Confermato"
          : rawStatus === "unpaid"
          ? "In attesa"
          : "Confermato";

      // ✅ Corrección: evitar total null
      res.status(200).json({
        orderId: paymentIntent?.id || session.id, // ID real del pago
        status: normalizedStatus,
        email: session.customer_details?.email,
        date: new Date(),
        total: session.amount_total ? session.amount_total / 100 : 0,
        paymentMethod: `${paymentMethod.toUpperCase()} ${last4}`.trim(),
      });
    } catch (err) {
      console.error("Errore recuperando sessione Stripe:", err);
      res.status(500).json({ error: "Errore recuperando sessione Stripe" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);
