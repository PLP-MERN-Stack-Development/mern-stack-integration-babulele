// errorHandler.js - Custom error handling middleware

/**
 * Custom Error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Convert Mongoose validation errors to user-friendly format
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

/**
 * Handle duplicate field errors (like duplicate email)
 */
const handleDuplicateFieldsDB = (err) => {
  // Handle both old and new Mongoose error formats
  let field = 'field';
  let value = 'value';
  
  if (err.keyPattern) {
    // New Mongoose format (v6+)
    field = Object.keys(err.keyPattern)[0];
    value = err.keyValue ? err.keyValue[field] : 'value';
  } else if (err.errmsg) {
    // Old Mongoose format
    const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
    if (match) {
      value = match[0];
    }
    // Try to extract field name from index name
    const indexMatch = err.errmsg.match(/index: (.+?)_/);
    if (indexMatch) {
      field = indexMatch[1];
    }
  }
  
  const message = `Duplicate ${field} value: ${value}. Please use another value!`;
  return new ApiError(message, 400);
};

/**
 * Handle Mongoose validation errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
    stack: err.stack,
    ...err,
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      error: 'Something went wrong!',
    });
  }
};

/**
 * Main error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Handle specific MongoDB errors first (works in both dev and prod)
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  } else if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  } else if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = {
  ApiError,
  errorHandler,
};

