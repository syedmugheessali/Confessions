const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving if it has been modified (with lifecycle logging)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }


  console.log('\n--- [AUTH LIFECYCLE: PRE-SAVE] ---');
  console.log(`User: ${this.email} (${this.name})`);
  console.log(`Plaintext password received: "${this.password}"`);


  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);


  console.log(`Generated Salt (10 rounds):   ${salt}`);
  console.log(`Generated bcrypt Hash:        ${hash}`);
  console.log('----------------------------------\n');


  this.password = hash;
  next();
});

// Post-save hook to observe when the document is written to MongoDB
userSchema.post('save', function (doc) {

  console.log(`[AUTH LIFECYCLE: POST-SAVE] User "${doc.email}" saved to MongoDB.`);

});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);


  console.log('\n--- [AUTH LIFECYCLE: LOGIN VERIFICATION] ---');
  console.log(`User: ${this.email}`);
  console.log(`Entered plaintext password: "${enteredPassword}"`);
  console.log(`Stored database hash:       ${this.password}`);
  console.log(`Verification result:        ${isMatch ? 'SUCCESS (MATCH)' : 'FAILED (MISMATCH)'}`);
  console.log('--------------------------------------------\n');


  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
