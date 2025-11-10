// /api/capture-paypal-order.js
const { generateAccessToken, captureOrder } = require('./lib/paypal');

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
      const { orderID } = req.query;

      // 🔹 Validación adicional (opcional, mejora de robustez)
      if (!orderID) {
        return res.status(400).json({ error: "orderID mancante" });
      }

      const accessToken = await generateAccessToken();
      const data = await captureOrder(orderID, accessToken);

      const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];

      // ✅ Corrección: convertir total a número y estandarizar estado con soporte para "PENDING"
      const normalizedStatus =
        data.status === "COMPLETED"
          ? "Confermato"
          : data.status === "PENDING"
          ? "In attesa"
          : data.status || "Confermato";

      res.status(200).json({
        orderId: data.id || capture?.id,
        status: normalizedStatus,
        email: data.payer?.email_address,
        date: new Date(),
        total: parseFloat(capture?.amount?.value || 0),
        paymentMethod: "PayPal"
      });
    } catch (err) {
      console.error("Error capturing PayPal order:", err);
      res.status(500).json({ error: "Error capturing PayPal order" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);
