const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Sign JWT token helper.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

/**
 * Send token response helper.
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: userData
  });
};

/**
 * Auth operations controller.
 */
class AuthController {
  // POST /api/v1/auth/signup
  async signup(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('Email is already registered');
        error.statusCode = 400;
        return next(error);
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user' // Default to user, but allow seeding/admin configuration
      });

      sendTokenResponse(user, 201, res, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate email and password presence
      if (!email || !password) {
        const error = new Error('Please provide email and password');
        error.statusCode = 400;
        return next(error);
      }

      // Check for user (include password field for verification)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        const error = new Error('Invalid email or password credentials');
        error.statusCode = 401;
        return next(error);
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        const error = new Error('Invalid email or password credentials');
        error.statusCode = 401;
        return next(error);
      }

      sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/auth/profile
  async getProfile(req, res, next) {
    try {
      // req.user was populated by protect middleware
      res.status(200).json({
        success: true,
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/auth/profile
  async updateProfile(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Find user
      const user = await User.findById(req.user.id).select('+password');
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }

      // Update fields if provided
      if (name) user.name = name;
      if (email) {
        // If email is changing, check that new email is unique
        if (email !== user.email) {
          const emailTaken = await User.findOne({ email });
          if (emailTaken) {
            const error = new Error('Email is already in use');
            error.statusCode = 400;
            return next(error);
          }
          user.email = email;
        }
      }
      if (password) user.password = password;

      await user.save();

      sendTokenResponse(user, 200, res, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
