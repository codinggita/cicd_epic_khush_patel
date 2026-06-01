const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const workflowRoutes = require('./routes/workflowRoutes');
const infraRoutes = require('./routes/infraRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Load Environment Variables (just in case they are not loaded globally yet)
require('dotenv').config();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Enable HTTP Request logger in development/non-test environment
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Default status endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API Routes mounting
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/infra', infraRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Catch-all route handler for 404 Not Found
app.use((req, res, next) => {
  const error = new Error(`Cannot find requested route ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
