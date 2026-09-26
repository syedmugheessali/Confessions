/**
 * Migration script: Remove expiration from confessions
 * 
 * This script:
 * 1. Drops the TTL index on expiresAt so MongoDB stops auto-deleting confessions
 * 2. Removes the expiresAt field from all existing confession documents
 * 
 * Run with: node migrate-remove-expiration.js
 */
const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dotenv.config();

// Fix for Node.js SRV DNS resolution (ECONNREFUSED) only on local Windows networks
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Ignore if unable to set custom DNS
  }
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('confessions');

    // Step 1: Drop the TTL index on expiresAt
    try {
      const indexes = await collection.indexes();
      const ttlIndex = indexes.find(
        (idx) => idx.key && idx.key.expiresAt !== undefined
      );

      if (ttlIndex) {
        await collection.dropIndex(ttlIndex.name);
        console.log(`Dropped TTL index: "${ttlIndex.name}"`);
      } else {
        console.log('No TTL index found on expiresAt — skipping.');
      }
    } catch (err) {
      console.log('Could not drop TTL index (may not exist):', err.message);
    }

    // Step 2: Remove the expiresAt field from all documents
    const result = await collection.updateMany(
      { expiresAt: { $exists: true } },
      { $unset: { expiresAt: '' } }
    );
    console.log(`Removed expiresAt from ${result.modifiedCount} document(s).`);

    console.log('\nMigration complete! Confessions are now permanent.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

run();
