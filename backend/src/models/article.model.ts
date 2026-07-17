import mongoose, { Schema } from 'mongoose';
import { IArticleDocument } from '../interfaces/article.interface';
import { ArticleStatus } from '../types/enums';

const articleSchema = new Schema<IArticleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [250, 'Article title must be at most 250 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Article slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Article excerpt is required'],
      trim: true,
      maxlength: [500, 'Article excerpt must be at most 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    seo: {
      metaTitle: { type: String, trim: true, default: '' },
      metaDescription: { type: String, trim: true, default: '' },
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ArticleStatus),
      default: ArticleStatus.DRAFT,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Keep author and authorId synced on save
articleSchema.pre('save', function () {
  if (this.author && !this.authorId) {
    this.authorId = this.author;
  } else if (this.authorId && !this.author) {
    this.author = this.authorId;
  }
});

// Single Indexes
articleSchema.index({ slug: 1 }, { unique: true });
articleSchema.index({ author: 1 });
articleSchema.index({ authorId: 1 });
articleSchema.index({ status: 1 });
articleSchema.index({ categories: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ viewCount: -1 });
articleSchema.index({ likeCount: -1 });
articleSchema.index({ commentCount: -1 });
articleSchema.index({ isDeleted: 1 });

// Full-text search index
articleSchema.index(
  { title: 'text', excerpt: 'text', content: 'text' },
  { weights: { title: 10, excerpt: 5, content: 1 } },
);

// Compound Indexes for fast public and dashboard queries
articleSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });
articleSchema.index({ author: 1, status: 1, isDeleted: 1 });
articleSchema.index({ categories: 1, status: 1, isDeleted: 1, publishedAt: -1 });
articleSchema.index({ viewCount: -1, likeCount: -1, commentCount: -1 });

const Article = mongoose.model<IArticleDocument>('Article', articleSchema);

export default Article;
