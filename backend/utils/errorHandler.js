const errorHandler = (err, req, res, _next) => {
  // If res.statusCode is already set (e.g., in a controller), use that.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Provide stack trace only in development environment for security
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { errorHandler };
