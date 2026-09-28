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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Confession', confessionSchema);
