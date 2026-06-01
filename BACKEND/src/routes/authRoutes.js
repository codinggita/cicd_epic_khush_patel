const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Public authentication routes
router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));

// Protected profile routes
router.get('/profile', protect, (req, res, next) => authController.getProfile(req, res, next));
router.put('/profile', protect, (req, res, next) => authController.updateProfile(req, res, next));

module.exports = router;
