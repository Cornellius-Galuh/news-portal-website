import mongoose, { Schema } from 'mongoose';
import { IArticleLikeDocument } from '../interfaces/article.interface';

const articleLikeSchema = new Schema<IArticleLikeDocument>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article ID is required for like tracking'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for like tracking'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: 'article_likes',
  },
);

// Single Indexes
articleLikeSchema.index({ articleId: 1 });
articleLikeSchema.index({ userId: 1 });

// Unique Compound Index to prevent duplicate likes by the same user on the same article
articleLikeSchema.index({ articleId: 1, userId: 1 }, { unique: true });

const ArticleLike = mongoose.model<IArticleLikeDocument>('ArticleLike', articleLikeSchema);

export default ArticleLike;
