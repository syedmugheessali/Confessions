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
        content: "Subhan bhai told us 'bas 5 minute mein pohanch raha hoon' exactly 2 hours and 43 minutes ago. We are still sitting at the cafe contemplating our life choices.",
        user: muddi,
        likes: [shayan, amusha, john],
        dislikes: [],
      },
      {
        content: "I borrowed Subhan bhai's car last week and returned it with 0km range on reserve fuel. If you're reading this Subhan bhai, thank you for your unintentional sponsorship.",
        user: shayan,
        likes: [muddi, amusha],
        dislikes: [subhan],
      },
      {
        content: "Subhan bhai gives 45-minute motivational lectures on discipline, waking up at 5 AM, and grinding, but he woke up at 3:30 PM today.",
        user: amusha,
        likes: [muddi, shayan, john, mod],
        dislikes: [],
      },
      {
        content: "Nobody has the courage to tell Subhan bhai that his road-trip playlist is 90% nostalgic heartbreak songs from 2008.",
        user: john,
        likes: [muddi, shayan],
        dislikes: [],
      },
      {
        content: "Subhan bhai said he was on a strict zero-carb diet, but I saw him discreetly eating two shawarmas in the back parking lot at 1 AM.",
        user: muddi,
        likes: [amusha, shayan, admin],
        dislikes: [],
      },

      // Muddi bhai confessions
      {
        content: "Whenever the restaurant bill arrives, Muddi bhai suddenly receives an 'urgent phone call' and vanishes into thin air for 25 minutes.",
        user: subhan,
        likes: [shayan, amusha, john, mod],
        dislikes: [muddi],
      },
      {
        content: "Muddi bhai has sworn to start his serious gym transformation 'next Monday' every single week since October 2021.",
        user: shayan,
        likes: [subhan, amusha, john],
        dislikes: [],
      },
      {
        content: "Muddi bhai will spend 4 hours aggressively negotiating over a 50 rupee delivery fee, but will casually drop 15k on custom mechanical keyboard switches without blinking.",
        user: amusha,
        likes: [subhan, shayan, admin],
        dislikes: [],
      },
      {
        content: "Muddi bhai borrowed my favorite black hoodie three months ago and now he posts Instagram pictures in it with captions like 'vintage vibes'. Muddi bhai please return it.",
        user: john,
        likes: [subhan, amusha, shayan],
        dislikes: [],
      },
      {
        content: "I watched Muddi bhai order a Diet Coke after destroying two double-patty zinger burgers and a bucket of loaded fries. Balance is truly his passion.",
        user: subhan,
        likes: [shayan, amusha],
        dislikes: [],
      },

      // Shayan confessions
      {
        content: "Shayan spent the entire night before finals crying in the group chat that he hadn't studied a single page and was going to fail, only to score the highest marks in class. Classic Shayan.",
        user: amusha,
        likes: [subhan, muddi, john],
        dislikes: [],
      },
      {
        content: "Shayan spent 6 hours aggressively debugging why his code wouldn't update, only to realize he was running a completely different project in his terminal the whole time.",
        user: muddi,
        likes: [subhan, amusha, john, mod],
        dislikes: [shayan],
      },
      {
        content: "Shayan currently has 19 unfinished side projects on GitHub, and literally all of them are titled 'next-big-thing-final-v2-real'.",
        user: subhan,
        likes: [muddi, amusha, admin],
        dislikes: [],
      },
      {
        content: "Shayan always says 'main bas 10 baje nikal jaunga ghar ke liye', but at 2:30 AM he is still suggesting new chai dhabas to visit.",
        user: john,
        likes: [subhan, muddi, amusha],
        dislikes: [],
      },
      {
        content: "Shayan swore on everything that he was quitting gaming to focus on his startup, but his Steam profile shows 48 hours logged in the past 3 days.",
        user: muddi,
        likes: [subhan, amusha],
        dislikes: [],
      },

      // Amusha confessions
      {
        content: "Amusha has breaking news and certified gossip on literally everyone in our circle before the events even happen in real life. MI6 and CIA need to hire her immediately.",
        user: subhan,
        likes: [muddi, shayan, john],
        dislikes: [],
      },
      {
        content: "Amusha spends 40 minutes analyzing every single item on the menu, asks the waiter 20 questions, orders plain fries, and then ends up eating half of everyone else's food.",
        user: shayan,
        likes: [subhan, muddi, john, admin],
        dislikes: [amusha],
      },
      {
        content: "If you ever tell Amusha a secret and say 'please kisi ko mat batana', just know that her definition of 'kisi' excludes her 4 favorite WhatsApp group chats.",
        user: muddi,
        likes: [subhan, shayan, john],
        dislikes: [],
      },
      {
        content: "Amusha will send you an Instagram reel from 2019 at 3 AM with the caption 'BROOO THIS IS LITERALLY US 😭💀'.",
        user: shayan,
        likes: [subhan, muddi],
        dislikes: [],
      },
      {
        content: "Amusha has this superpower where she starts laughing hysterically at the most inappropriate, dead-serious moments and gets everyone in the room in trouble.",
        user: subhan,
        likes: [muddi, shayan, john, mod],
        dislikes: [],
      },

      // Group & squad banter
      {
        content: "Can someone please stage an intervention for Muddi bhai and Subhan bhai? They have been loudly debating whether Python or JavaScript is superior for four straight years.",
        user: shayan,
        likes: [amusha, john, admin],
        dislikes: [],
      },
      {
        content: "I secretly switched the dhaba chai to decaf and watched Subhan bhai, Muddi bhai, and Shayan convince each other they were experiencing an intense caffeine coding rush.",
        user: amusha,
        likes: [john, admin, mod],
        dislikes: [subhan, muddi, shayan],
      },
      {
        content: "The only thing more terrifying than production crashing on a Friday night is Amusha when her food delivery arrives missing garlic mayo.",
        user: muddi,
        likes: [subhan, shayan, john],
        dislikes: [amusha],
      },
      {
        content: "Muddi bhai and Shayan swore they would reach the hangout on time today. It has been two hours. I have finished my drink, finished my existential crisis, and they're still 'just around the corner'.",
        user: subhan,
        likes: [amusha, john, admin],
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
