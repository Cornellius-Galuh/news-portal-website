import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import AppError from '../utils/app-error';
import env from '../config/env';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // 3. Find user by ID (include check for deleted users)
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found or has been deleted.', 401);
    }

    // 4. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token.', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token has expired.', 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore token errors for optional auth (treat as anonymous)
  }
  next();
};

export default authMiddleware;
