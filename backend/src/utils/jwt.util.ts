import jwt from 'jsonwebtoken';
import env from '../config/env';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string & jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
};
