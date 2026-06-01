const User = require('../models/user');
const { applyQuery } = require('../utils/queryHelper');

/**
 * Controller to handle Admin CRUD operations on users.
 */
class UserController {
  // GET /api/v1/users (Admin Only)
  async getUsers(req, res, next) {
    try {
      const result = await applyQuery(User, req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/users/:id (Admin Only)
  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/users (Admin Only)
  async createUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        const error = new Error('Please provide name, email, and password');
        error.statusCode = 400;
        return next(error);
      }

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('Email is already registered');
        error.statusCode = 400;
        return next(error);
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
      });

      // Exclude password in response
      const userObj = user.toObject();
      delete userObj.password;

      res.status(201).json({
        success: true,
        message: 'User created successfully by administrator',
        data: userObj
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/users/:id (Admin Only)
  async updateUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const user = await User.findById(req.params.id).select('+password');
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }

      // Update fields if provided
      if (name) user.name = name;
      if (email) {
        if (email !== user.email) {
          const emailExists = await User.findOne({ email });
          if (emailExists) {
            const error = new Error('Email is already in use');
            error.statusCode = 400;
            return next(error);
          }
          user.email = email;
        }
      }
      if (role) user.role = role;
      if (password) user.password = password;

      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      res.status(200).json({
        success: true,
        message: 'User updated successfully by administrator',
        data: userObj
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/users/:id (Admin Only)
  async deleteUser(req, res, next) {
    try {
      // Prevent deleting own admin account
      if (req.user.id === req.params.id) {
        const error = new Error('You cannot delete your own account');
        error.statusCode = 400;
        return next(error);
      }

      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }

      res.status(200).json({
        success: true,
        message: 'User account permanently deleted',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
