import mongoose, { Schema } from 'mongoose';
import { IAuthorRequestDocument } from '../interfaces/author-request.interface';
import { AuthorRequestStatus } from '../types/enums';

const authorRequestSchema = new Schema<IAuthorRequestDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters'],
      maxlength: [500, 'Reason must be at most 500 characters'],
    },
    status: {
      type: String,
      enum: Object.values(AuthorRequestStatus),
      default: AuthorRequestStatus.PENDING,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
authorRequestSchema.index({ userId: 1 });
authorRequestSchema.index({ status: 1 });

const AuthorRequest = mongoose.model<IAuthorRequestDocument>('AuthorRequest', authorRequestSchema);

export default AuthorRequest;
