// Catch-all error handler so an unexpected throw returns JSON instead of an HTML stack trace.
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
