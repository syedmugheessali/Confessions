const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js syedmugheessali@gmail.com');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User not found with email: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Success: ${user.name} (${user.email}) is now an ADMIN!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
