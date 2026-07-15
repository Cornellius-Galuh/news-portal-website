import { Document } from 'mongoose';
import { UserRole } from '../types/enums';

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  socialLinks: ISocialLink[];
  isDeleted: boolean;
  deletedAt?: Date;
  joinedAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}
