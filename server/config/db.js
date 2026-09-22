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

/**
 * Connects to the MongoDB database using Mongoose.
 * Reuses existing connection in serverless environments.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
