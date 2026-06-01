const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware to protect routes and verify JWT tokens.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if authorization header exists and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Split the header to get token
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Not authorized to access this route, token is missing');
      error.statusCode = 401;
      return next(error);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in database, attaching it to request
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        const error = new Error('The user belonging to this token no longer exists');
        error.statusCode = 401;
        return next(error);
      }

      next();
    } catch (err) {
      const error = new Error('Not authorized to access this route, token is invalid');
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware to restrict access to specific roles.
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(`User role "${req.user ? req.user.role : 'none'}" is not authorized to access this resource`);
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
