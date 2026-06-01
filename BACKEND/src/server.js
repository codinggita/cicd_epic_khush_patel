const app = require('./app');
const connectDB = require('./config/db');

// Ensure environment variables are loaded
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Start Server Wrapper
const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express HTTP Server listener
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
