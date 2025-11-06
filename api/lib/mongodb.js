// /api/_lib/mongodb.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Definición del Schema y Modelo
const serviceSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: String,
  description: String,
  duration: String,
  price: Number,
  isPromo: Boolean,
  category: String,
  image: String,
  details: [String] 
});

// Evitar sobreescribir el modelo si ya existe
const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

module.exports = { dbConnect, Service };