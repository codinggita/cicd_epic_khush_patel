/**
 * Global centralized Express error handler middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;
  // Make sure message is preserved
  error.message = err.message;

  // Log to console for development
  if (process.env.NODE_ENV !== 'production') {
    console.error('--- ERROR DETECTED ---');
    console.error(err);
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // 2. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  // 4. Default Error response
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
