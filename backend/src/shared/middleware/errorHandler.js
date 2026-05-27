// ============================================================
//  shared/middleware/errorHandler.js — Global error handler
//  Register LAST in server.js: app.use(errorHandler)
// ============================================================

export function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}
