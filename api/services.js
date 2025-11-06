// /api/services.js
const { dbConnect, Service } = require('./lib/mongodb');
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
      await dbConnect(); // Conectar a la base de datos
      const services = await Service.find(); // Obtener servicios
      res.status(200).json(services);
    } catch (err) {
      console.error("Error al obtener servicios:", err);
      res.status(500).json({ error: "Error al obtener servicios de la base de datos" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

module.exports = allowCors(handler);