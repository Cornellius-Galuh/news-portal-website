import { Document, Types } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {}
