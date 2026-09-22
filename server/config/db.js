const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Node.js SRV DNS resolution (ECONNREFUSED) only on local Windows networks
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Ignore if unable to set custom DNS
  }
}

let cachedPromise = null;

/**
 * Connects to the MongoDB database using Mongoose.
 * Reuses existing connection and cached promise in serverless environments.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    }).then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }).catch((err) => {
      cachedPromise = null;
      console.error(`Error connecting to MongoDB: ${err.message}`);
      throw err;
    });
  }

  await cachedPromise;
};

module.exports = connectDB;
