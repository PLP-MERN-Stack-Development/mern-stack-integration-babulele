// server.js - Main server file for the MERN blog application

// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Import error handler
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  const clientBuildPath = path.join(__dirname, '../client/dist');
  
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    
    // Handle React routing - return all requests to React app
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          error: `API route ${req.originalUrl} not found`,
        });
      }
      
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    // If client build doesn't exist, just serve API info
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'MERN Blog API is running',
        version: '1.0.0',
        endpoints: {
          posts: '/api/posts',
          categories: '/api/categories',
          auth: '/api/auth',
        },
        note: 'Frontend build not found. Deploy frontend separately or build it.',
      });
    });
    
    // Handle 404 - routes not found
    app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
      });
    });
  }
} else {
  // Development mode - just serve API info
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'MERN Blog API is running',
      version: '1.0.0',
      endpoints: {
        posts: '/api/posts',
        categories: '/api/categories',
        auth: '/api/auth',
      },
    });
  });
  
  // Handle 404 - routes not found
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      error: `Route ${req.originalUrl} not found`,
    });
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app; 