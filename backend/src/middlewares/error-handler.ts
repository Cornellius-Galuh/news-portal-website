import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app-error';
import logger from '../config/logger';
import env from '../config/env';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  // Default values
  let statusCode = 500;
  let message = 'Internal Server Error';

  // If it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
