import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app-error';
import { UserRole } from '../types/enums';

const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // User must be authenticated first (auth middleware should run before this)
    if (!req.user) {
      return next(new AppError('Not authorized. Please login first.', 401));
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new AppError('Forbidden. You do not have permission to access this resource.', 403),
      );
    }

    next();
  };
};

export default roleMiddleware;
