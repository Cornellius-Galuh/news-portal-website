import { Document, Types, Model } from 'mongoose';
import { ArticleStatus } from '../types/enums';

export interface IArticleSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface IArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  images?: string[];
  author: Types.ObjectId;
  authorId?: Types.ObjectId;
  categories: Types.ObjectId[];
  tags?: string[];
  seo?: IArticleSeo;
  viewCount: number;
  likeCount: number;
  commentCount?: number;
  status: ArticleStatus;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IArticleDocument extends IArticle, Document {}

export interface IArticleView {
  articleId: Types.ObjectId;
  userId?: Types.ObjectId | null;
  ipHash?: string;
  ipAddress?: string;
  viewedAt: Date;
}

export interface IArticleViewDocument extends IArticleView, Document {}

export interface IArticleViewModel extends Model<IArticleViewDocument> {
  hasViewedRecently(
    articleId: string | Types.ObjectId,
    identifier: { userId?: string | Types.ObjectId | null; ipHash?: string },
    windowMs?: number,
  ): Promise<boolean>;
}

export interface IArticleLike {
  articleId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

export interface IArticleLikeDocument extends IArticleLike, Document {}
