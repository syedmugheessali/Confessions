const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Node.js SRV DNS resolution (ECONNREFUSED) on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to set custom DNS
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Exits the process if connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
