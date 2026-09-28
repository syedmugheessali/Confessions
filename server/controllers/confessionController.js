const Confession = require('../models/Confession');

// @desc    Create a confession
// @route   POST /api/confessions
// @access  Private
exports.createConfession = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.length > 1000) {
      return res.status(400).json({ success: false, message: 'Content is required and must be less than 1000 characters' });
    }

    const confession = await Confession.create({
      content,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: confession._id,
        content: confession.content,
        createdAt: confession.createdAt,
        likes: [],
        dislikes: [],
        likesCount: 0,
        dislikesCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all confessions
// @route   GET /api/confessions
// @access  Public
exports.getConfessions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Run count and query in parallel over MongoDB connection
    const [total, confessions] = await Promise.all([
      Confession.countDocuments(),
      Confession.find()
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .select('-user'),
    ]);

    // Map confessions to include counts
    const confessionsWithCounts = confessions.map((c) => ({
      _id: c._id,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      likesCount: c.likes ? c.likes.length : 0,
      dislikesCount: c.dislikes ? c.dislikes.length : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        confessions: confessionsWithCounts,
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
    const confession = await Confession.findById(req.params.id).select('-user');

    if (!confession) {
      return res.status(404).json({ success: false, message: 'Confession not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        ...confession.toObject(),
        likesCount: confession.likes ? confession.likes.length : 0,
        dislikesCount: confession.dislikes ? confession.dislikes.length : 0,
      },
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
    const confessions = await Confession.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    const confessionsWithCounts = confessions.map((c) => ({
      _id: c._id,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      likesCount: c.likes ? c.likes.length : 0,
      dislikesCount: c.dislikes ? c.dislikes.length : 0,
    }));

    res.status(200).json({
      success: true,
      data: confessionsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a confession
// @route   PUT /api/confessions/:id/like
// @access  Private
exports.likeConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ success: false, message: 'Confession not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = confession.likes.some((id) => id.toString() === userId);
    const alreadyDisliked = confession.dislikes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      // Toggle off — remove like
      confession.likes = confession.likes.filter((id) => id.toString() !== userId);
    } else {
      // Add like and remove dislike if present
      confession.likes.push(req.user._id);
      if (alreadyDisliked) {
        confession.dislikes = confession.dislikes.filter((id) => id.toString() !== userId);
      }
    }

    await confession.save();

    res.status(200).json({
      success: true,
      data: {
        likesCount: confession.likes.length,
        dislikesCount: confession.dislikes.length,
        userLiked: !alreadyLiked,
        userDisliked: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dislike a confession
// @route   PUT /api/confessions/:id/dislike
// @access  Private
exports.dislikeConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ success: false, message: 'Confession not found' });
    }

    const userId = req.user._id.toString();
    const alreadyDisliked = confession.dislikes.some((id) => id.toString() === userId);
    const alreadyLiked = confession.likes.some((id) => id.toString() === userId);

    if (alreadyDisliked) {
      // Toggle off — remove dislike
      confession.dislikes = confession.dislikes.filter((id) => id.toString() !== userId);
    } else {
      // Add dislike and remove like if present
      confession.dislikes.push(req.user._id);
      if (alreadyLiked) {
        confession.likes = confession.likes.filter((id) => id.toString() !== userId);
      }
    }

    await confession.save();

    res.status(200).json({
      success: true,
      data: {
        likesCount: confession.likes.length,
        dislikesCount: confession.dislikes.length,
        userLiked: false,
        userDisliked: !alreadyDisliked,
      },
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
