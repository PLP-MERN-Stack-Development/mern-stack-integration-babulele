// db.js - MongoDB connection configuration

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error(' MONGODB_URI is not set in environment variables');
      console.error('Please set MONGODB_URI in your .env file');
      process.exit(1);
    }

    // Log connection attempt (without showing the full URI for security)
    const uriParts = process.env.MONGODB_URI.split('@');
    const dbInfo = uriParts.length > 1 ? uriParts[1] : 'localhost';
    

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Add connection options to handle authentication errors better
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(' MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(' Error connecting to MongoDB:', error.message);
    
    // Provide helpful error messages based on error type
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\n Authentication failed. Please check:');
      console.error('   1. Your MongoDB username and password in MONGODB_URI');
      console.error('   2. That your MongoDB user has the correct permissions');
      console.error('   3. That your MongoDB connection string is correct');
      console.error('\n   Example format: mongodb://username:password@host:port/database');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('\n Connection refused. Please check:');
      console.error('   1. MongoDB is running on your machine');
      console.error('   2. The host and port in MONGODB_URI are correct');
      console.error('   3. MongoDB is accessible from your network');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n Host not found. Please check:');
      console.error('   1. The hostname in MONGODB_URI is correct');
      console.error('   2. Your internet connection is working');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

