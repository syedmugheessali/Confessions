const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const User = require('./models/User');
const Confession = require('./models/Confession');

// Load env vars
dotenv.config();

// Fix for Node.js SRV DNS resolution (ECONNREFUSED) on Windows
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Ignore
  }
}

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Moderator User',
    email: 'mod@example.com',
    password: 'password123',
    role: 'moderator',
  },
  {
    name: 'Subhan',
    email: 'subhan@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Mudassir (Muddi)',
    email: 'muddi@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Shayan',
    email: 'shayan@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Amusha',
    email: 'amusha@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
];

const seedData = async () => {
  try {
    await User.deleteMany();
    await Confession.deleteMany();

    const createdUsers = await User.create(users);
    console.log('Users seeded');

    const admin = createdUsers[0]._id;
    const mod = createdUsers[1]._id;
    const subhan = createdUsers[2]._id;
    const muddi = createdUsers[3]._id;
    const shayan = createdUsers[4]._id;
    const amusha = createdUsers[5]._id;
    const john = createdUsers[6]._id;

    const confessions = [
      // Subhan bhai confessions
      {
        content: "I borrowed Subhan bhai's car last week and returned it with 0km range on reserve fuel. If you're reading this Subhan bhai, thank you for your unintentional sponsorship.",
        user: shayan,
        likes: [muddi, amusha],
        dislikes: [subhan],
      },
      {
        content: "Muddi bhai will spend 4 hours arguing claude vs antigravity, but will casually use claude for his outgle if he gets it for free",
        user: amusha,
        likes: [subhan, shayan, admin],
        dislikes: [],
      },

      {
        content: "If you ever tell Amusha a secret and say 'please kisi ko mat batana', just know that her definition of 'kisi' excludes her 4 favorite WhatsApp group chats.",
        user: muddi,
        likes: [subhan, shayan, john],
        dislikes: [],
      },
    ];

    await Confession.create(confessions);
    console.log(`Successfully seeded ${confessions.length} confessions!`);

    console.log('Database seeded successfully! THIS IS FOR DEVELOPMENT ONLY.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
