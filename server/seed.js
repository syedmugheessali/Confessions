const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Confession = require('./models/Confession');
const { VALID_DURATIONS } = require('./utils/constants');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

const seedData = async () => {
  try {
    await User.deleteMany();
    await Confession.deleteMany();

    const createdUsers = await User.create(users);
    console.log('Users seeded');

    const confessions = [
      {
        content: 'I ate the last slice of pizza.',
        user: createdUsers[0]._id,
        expiresAt: new Date(Date.now() + VALID_DURATIONS['1h']),
      },
      {
        content: 'I pretend to work when I am actually browsing Reddit.',
        user: createdUsers[1]._id,
        expiresAt: new Date(Date.now() + VALID_DURATIONS['6h']),
      },
      {
        content: 'I broke the vase and blamed it on the dog.',
        user: createdUsers[0]._id,
        expiresAt: new Date(Date.now() + VALID_DURATIONS['24h']),
      },
      {
        content: 'I skip leg day every week.',
        user: createdUsers[1]._id,
        expiresAt: new Date(Date.now() + VALID_DURATIONS['3d']),
      },
      {
        content: 'I still sleep with a night light.',
        user: createdUsers[0]._id,
        expiresAt: new Date(Date.now() + VALID_DURATIONS['7d']),
      },
    ];

    await Confession.create(confessions);
    console.log('Confessions seeded');

    console.log('Database seeded successfully! THIS IS FOR DEVELOPMENT ONLY.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
