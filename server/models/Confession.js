const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please add confession content'],
      trim: true,
      maxlength: [1000, 'Confession cannot exceed 1000 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a TTL index to automatically delete expired confessions from the database
confessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual to check if the confession has expired
confessionSchema.virtual('isExpired').get(function () {
  return this.expiresAt < new Date();
});

// Virtual to get the remaining time in milliseconds
confessionSchema.virtual('remainingTime').get(function () {
  const now = new Date();
  const remaining = this.expiresAt.getTime() - now.getTime();
  return remaining > 0 ? remaining : 0;
});

module.exports = mongoose.model('Confession', confessionSchema);
