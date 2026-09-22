const app = require('../server/app');
const connectDB = require('../server/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB Atlas IP Access List allows 0.0.0.0/0 and your MONGODB_URI is correct.',
      error: error.message,
    });
  }
};
