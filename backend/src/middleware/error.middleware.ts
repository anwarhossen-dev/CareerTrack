import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Middleware Caught]:', err.stack || err.message || err);

  const status = err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  // Return formatted JSON instead of raw stack trace for security reasons
  return res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
