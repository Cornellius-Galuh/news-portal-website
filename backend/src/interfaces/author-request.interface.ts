import { Document, Types } from 'mongoose';
import { AuthorRequestStatus } from '../types/enums';

export interface IAuthorRequest {
  userId: Types.ObjectId;
  reason: string;
  status: AuthorRequestStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthorRequestDocument extends IAuthorRequest, Document {}
