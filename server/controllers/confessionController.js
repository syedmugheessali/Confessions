const Confession = require('../models/Confession');
const { VALID_DURATIONS } = require('../utils/constants');

// @desc    Create a confession
// @route   POST /api/confessions
// @access  Private
exports.createConfession = async (req, res, next) => {
  try {
    const { content, duration } = req.body;

    if (!content || content.length > 1000) {
      return res.status(400).json({ success: false, message: 'Content is required and must be less than 1000 characters' });
    }

    if (!duration || !VALID_DURATIONS[duration]) {
      return res.status(400).json({ success: false, message: 'Invalid duration' });
    }

    const expiresAt = new Date(Date.now() + VALID_DURATIONS[duration]);

    const confession = await Confession.create({
      content,
      user: req.user._id,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      data: {
        id: confession._id,
        content: confession.content,
        expiresAt: confession.expiresAt,
        createdAt: confession.createdAt,
        isExpired: confession.isExpired,
        remainingTime: confession.remainingTime
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active confessions
// @route   GET /api/confessions
// @access  Public
exports.getConfessions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Only find confessions that haven't expired
    const query = { expiresAt: { $gt: new Date() } };

    // Run count and query in parallel over MongoDB connection
    const [total, confessions] = await Promise.all([
      Confession.countDocuments(query),
      Confession.find(query)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .select('-user'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        confessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single confession
// @route   GET /api/confessions/:id
// @access  Public
exports.getConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findOne({
      _id: req.params.id,
      expiresAt: { $gt: new Date() },
    }).select('-user');

    if (!confession) {
      return res.status(404).json({ success: false, message: 'Confession not found or has expired' });
    }

    res.status(200).json({
      success: true,
      data: confession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own confessions
// @route   GET /api/confessions/my
// @access  Private
exports.getMyConfessions = async (req, res, next) => {
  try {
    // Include expired ones that haven't been cleaned up by TTL yet
    const confessions = await Confession.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: confessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a confession
// @route   DELETE /api/confessions/:id
// @access  Private
exports.deleteConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ success: false, message: 'Confession not found' });
    }

    // Make sure user owns confession or has privileged role (admin/moderator)
    const isOwner = confession.user.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || req.user.role === 'moderator';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this confession' });
    }

    await confession.deleteOne();

    res.status(200).json({
      success: true,
      message: isStaff && !isOwner 
        ? 'Confession removed by moderator/admin' 
        : 'Confession deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
