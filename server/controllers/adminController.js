const User = require('../models/User');
const Confession = require('../models/Confession');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin & Moderator)
exports.getStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [
      totalUsers,
      adminCount,
      moderatorCount,
      userCount,
      activeConfessions,
      expiredConfessions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'moderator' }),
      User.countDocuments({ role: 'user' }),
      Confession.countDocuments({ expiresAt: { $gt: now } }),
      Confession.countDocuments({ expiresAt: { $lte: now } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        roles: {
          admin: adminCount,
          moderator: moderatorCount,
          user: userCount,
        },
        confessions: {
          active: activeConfessions,
          expired: expiredConfessions,
          total: activeConfessions + expiredConfessions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search ? req.query.search.trim() : '';
    const roleFilter = req.query.role;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (roleFilter && ['user', 'moderator', 'admin'].includes(roleFilter)) {
      query.role = roleFilter;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['user', 'moderator', 'admin'];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}`,
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Safety guard: Prevent the logged-in admin from demoting themselves if they are the sole admin
    if (targetUser._id.toString() === req.user._id.toString() && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote yourself: You are the last remaining administrator.',
        });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      data: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        updatedAt: targetUser.updatedAt,
      },
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get confessions for moderation (with author details)
// @route   GET /api/admin/confessions
// @access  Private (Admin & Moderator)
exports.getAdminConfessions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const status = req.query.status; // 'active', 'expired', or undefined for all

    const query = {};
    if (status === 'active') {
      query.expiresAt = { $gt: new Date() };
    } else if (status === 'expired') {
      query.expiresAt = { $lte: new Date() };
    }

    const total = await Confession.countDocuments(query);
    const confessions = await Confession.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        confessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin/Moderator forced delete of a confession
// @route   DELETE /api/admin/confessions/:id
// @access  Private (Admin & Moderator)
exports.deleteConfessionAdmin = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: 'Confession not found',
      });
    }

    await confession.deleteOne();

    res.status(200).json({
      success: true,
      message: `Confession deleted by ${req.user.role}`,
    });
  } catch (error) {
    next(error);
  }
};
