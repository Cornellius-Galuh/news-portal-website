import mongoose, { Schema } from 'mongoose';
import { IArticleViewDocument, IArticleViewModel } from '../interfaces/article.interface';

const articleViewSchema = new Schema<IArticleViewDocument>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article ID is required for tracking view'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ipHash: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: 'article_views',
  },
);

// Single Indexes
articleViewSchema.index({ articleId: 1 });
articleViewSchema.index({ userId: 1 });
articleViewSchema.index({ viewedAt: 1 });

// Compound Indexes for fast duplicate view prevention within time window
articleViewSchema.index({ articleId: 1, userId: 1, viewedAt: -1 });
articleViewSchema.index({ articleId: 1, ipHash: 1, viewedAt: -1 });

/**
 * Helper static query pattern check to verify if a view occurred within a time window (e.g. 1 hour)
 * Can be called by repositories or services to throttle view counts.
 */
articleViewSchema.statics.hasViewedRecently = async function (
  articleId: string | mongoose.Types.ObjectId,
  identifier: { userId?: string | mongoose.Types.ObjectId | null; ipHash?: string },
  windowMs: number = 60 * 60 * 1000,
): Promise<boolean> {
  const threshold = new Date(Date.now() - windowMs);
  const conditions: Record<string, unknown>[] = [];

  if (identifier.userId) {
    conditions.push({ userId: identifier.userId });
  }
  if (identifier.ipHash) {
    conditions.push({ ipHash: identifier.ipHash });
  }

  if (conditions.length === 0) {
    return false;
  }

  const existingView = await this.findOne({
    articleId,
    viewedAt: { $gte: threshold },
    $or: conditions,
  }).select('_id');

  return Boolean(existingView);
};

const ArticleView = mongoose.model<IArticleViewDocument, IArticleViewModel>('ArticleView', articleViewSchema);

export default ArticleView;
