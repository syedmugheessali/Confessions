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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Confession', confessionSchema);
