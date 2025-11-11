// /api/_lib/paypal.js
const fetch = require("node-fetch"); // Usamos node-fetch v2 compatible con Vercel

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
// CÓDIGO NUEVO
const base = "https://api-m.paypal.com"; // Entorno de producción

/**
 * Genera un Access Token de PayPal
 */
async function generateAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

/**
 * Crea una orden en PayPal
 */
async function createOrder(total, accessToken) {
  const response = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total.toString(),
          },
        },
      ],
    }),
  });
  return response.json();
}

/**
 * Captura el pago de una orden de PayPal
 */
async function captureOrder(orderID, accessToken) {
    const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.json();
}

module.exports = { generateAccessToken, createOrder, captureOrder };