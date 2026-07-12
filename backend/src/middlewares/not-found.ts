import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app-error';

const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

export default notFound;
