import articleRepository, { PaginatedArticlesResult } from '../repositories/article.repository';
import Category from '../models/category.model';
import ArticleView from '../models/article-view.model';
import ArticleLike from '../models/article-like.model';
import Article from '../models/article.model';
import { IArticleDocument } from '../interfaces/article.interface';
import { ArticleStatus, UserRole } from '../types/enums';
import AppError from '../utils/app-error';
import crypto from 'crypto';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

class ArticleService {
  /**
   * Automatically generate a URL-friendly slug from title and verify its uniqueness.
   * If collision occurs, append incremental number suffix.
   */
  async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!baseSlug) {
      throw new AppError('Title must generate a valid slug', 400);
    }

    let candidateSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await articleRepository.findByExactSlugRaw(candidateSlug);
      if (!existing || (excludeId && existing._id.toString() === excludeId)) {
        return candidateSlug;
      }
      candidateSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Validate that all category ObjectIds exist in the Category collection
   */
  private async validateCategoriesExist(categoryIds: string[]): Promise<void> {
    const uniqueIds = Array.from(new Set(categoryIds));
    const count = await Category.countDocuments({
      _id: { $in: uniqueIds },
    });

    if (count !== uniqueIds.length) {
      throw new AppError('One or more specified categories do not exist', 404);
    }
  }

  /**
   * Record article view with deduplication based on user ID or IP address hash within a 1-hour window.
   */
  async recordArticleView(
    articleId: string,
    clientInfo: { userId?: string | null; ipAddress?: string },
  ): Promise<void> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    const ipAddress = clientInfo.ipAddress || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ipAddress).digest('hex');
    const userId = clientInfo.userId || null;

    const hasViewed = await ArticleView.hasViewedRecently(
      articleId,
      { userId, ipHash },
      60 * 60 * 1000, // 1 hour window
    );

    if (!hasViewed) {
      await ArticleView.create({
        articleId: new mongoose.Types.ObjectId(articleId),
        userId: userId ? new mongoose.Types.ObjectId(userId) : null,
        ipHash,
        ipAddress,
        viewedAt: new Date(),
      });

      await Article.updateOne({ _id: articleId }, { $inc: { viewCount: 1 } });
    }
  }

  /**
   * Toggle article like by user and update likeCount.
   */
  async toggleArticleLike(articleId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    if (!userId) {
      throw new AppError('Authentication required to like articles', 401);
    }

    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    const existingLike = await ArticleLike.findOne({
      articleId: new mongoose.Types.ObjectId(articleId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    let liked = false;
    if (existingLike) {
      await ArticleLike.deleteOne({ _id: existingLike._id });
      await Article.updateOne({ _id: articleId }, { $inc: { likeCount: -1 } });
      liked = false;
    } else {
      await ArticleLike.create({
        articleId: new mongoose.Types.ObjectId(articleId),
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: new Date(),
      });
      await Article.updateOne({ _id: articleId }, { $inc: { likeCount: 1 } });
      liked = true;
    }

    const updated = await articleRepository.findById(articleId);
    return { liked, likeCount: updated?.likeCount || 0 };
  }

  async createArticle(data: {
    title: string;
    excerpt: string;
    content: string;
    categories: string[];
    tags?: string[];
    author: string;
  }): Promise<IArticleDocument> {
    await this.validateCategoriesExist(data.categories);

    const slug = await this.generateUniqueSlug(data.title);

    const article = await articleRepository.create({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      categories: data.categories as unknown as IArticleDocument['categories'],
      tags: data.tags || [],
      author: data.author as unknown as IArticleDocument['author'],
      authorId: data.author as unknown as IArticleDocument['authorId'],
      status: ArticleStatus.DRAFT,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      isDeleted: false,
    });

    return article;
  }

  async getArticles(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    author?: string;
    status?: string;
    category?: string;
    q?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<PaginatedArticlesResult> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const sort = typeof query.sort === 'string' && query.sort.trim() !== '' ? query.sort : 'createdAt';
    const order = typeof query.order === 'string' && ['asc', 'desc'].includes(query.order.toLowerCase()) ? query.order.toLowerCase() : 'desc';

    return articleRepository.findPaginated({
      page,
      limit,
      sort,
      order,
      author: query.author,
      status: query.status,
      category: query.category,
      q: query.q,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
  }

  async getLatestArticles(limit: number = 10): Promise<IArticleDocument[]> {
    const boundedLimit = Math.max(1, Math.min(50, limit));
    return articleRepository.findLatest(boundedLimit);
  }

  async getTrendingArticles(limit: number = 10): Promise<IArticleDocument[]> {
    const boundedLimit = Math.max(1, Math.min(50, limit));
    return articleRepository.findTrending(boundedLimit);
  }

  async getArticleById(id: string): Promise<IArticleDocument> {
    const article = await articleRepository.findByIdPopulated(id);
    if (!article) {
      throw new AppError('Article not found', 404);
    }
    return article;
  }

  async getArticleDetail(
    idOrSlug: string,
    clientInfo?: { userId?: string | null; ipAddress?: string },
  ): Promise<IArticleDocument> {
    let article: IArticleDocument | null = null;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      article = await articleRepository.findByIdPopulated(idOrSlug);
    }

    if (!article) {
      article = await articleRepository.findBySlug(idOrSlug);
    }

    if (!article) {
      throw new AppError('Article not found', 404);
    }

    if (clientInfo) {
      // Record view asynchronously without blocking response
      this.recordArticleView(article._id.toString(), clientInfo).catch(() => {
        // Suppress background tracking error
      });
    }

    return article;
  }

  async updateArticle(
    id: string,
    userId: string,
    userRole: string,
    data: {
      title?: string;
      excerpt?: string;
      content?: string;
      categories?: string[];
      tags?: string[];
      images?: string[];
      coverImage?: string;
      status?: ArticleStatus;
    },
  ): Promise<IArticleDocument> {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    // Authorization check: only article author or ADMIN can modify
    const isOwner = article.author && article.author.toString() === userId.toString();
    if (!isOwner && userRole !== UserRole.ADMIN) {
      throw new AppError('You are not authorized to update this article', 403);
    }

    // Editorial Business Rule: published articles cannot be edited directly without archiving first
    if (article.status === ArticleStatus.PUBLISHED) {
      throw new AppError(
        'Published articles cannot be edited directly. Please archive the article before modification.',
        400,
      );
    }

    const updatePayload: Partial<IArticleDocument> = {};

    if (data.categories) {
      await this.validateCategoriesExist(data.categories);
      updatePayload.categories = data.categories as unknown as IArticleDocument['categories'];
    }

    if (data.title && data.title !== article.title) {
      updatePayload.title = data.title;
      updatePayload.slug = await this.generateUniqueSlug(data.title, id);
    }

    if (data.excerpt !== undefined) {
      updatePayload.excerpt = data.excerpt;
    }

    if (data.content !== undefined) {
      updatePayload.content = data.content;
    }

    if (data.tags !== undefined) {
      updatePayload.tags = data.tags;
    }

    if (data.images !== undefined) {
      if (data.images.length > 10) {
        throw new AppError('Cannot have more than 10 gallery images', 400);
      }
      updatePayload.images = data.images;
    }

    if (data.coverImage !== undefined) {
      updatePayload.coverImage = data.coverImage;
    }

    if (data.status !== undefined) {
      updatePayload.status = data.status;
      if (data.status === ArticleStatus.DRAFT || data.status === ArticleStatus.PUBLISHED) {
        updatePayload.archivedAt = null;
      }
      if (data.status === ArticleStatus.PUBLISHED && !article.publishedAt) {
        updatePayload.publishedAt = new Date();
      }
    }

    const updated = await articleRepository.updateById(id, updatePayload);
    if (!updated) {
      throw new AppError('Failed to update article', 500);
    }

    return updated;
  }

  async deleteArticle(id: string, userId: string, userRole: string): Promise<void> {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    // Authorization check: only article author or ADMIN can delete
    const isOwner = article.author && article.author.toString() === userId.toString();
    if (!isOwner && userRole !== UserRole.ADMIN) {
      throw new AppError('You are not authorized to delete this article', 403);
    }

    const softDeleted = await articleRepository.softDeleteById(id);
    if (!softDeleted) {
      throw new AppError('Failed to delete article', 500);
    }
  }

  async uploadCoverImage(
    articleId: string,
    userId: string,
    userRole: string,
    file?: Express.Multer.File,
  ): Promise<IArticleDocument> {
    if (!file) {
      throw new AppError('Please upload a cover image file', 400);
    }

    const article = await articleRepository.findById(articleId);
    if (!article) {
      if (fs.existsSync(file.path)) {
        try { fs.unlinkSync(file.path); } catch { /* ignore */ }
      }
      throw new AppError('Article not found', 404);
    }

    const isOwner = article.author && article.author.toString() === userId.toString();
    if (!isOwner && userRole !== UserRole.ADMIN) {
      if (fs.existsSync(file.path)) {
        try { fs.unlinkSync(file.path); } catch { /* ignore */ }
      }
      throw new AppError('You are not authorized to update this article', 403);
    }

    if (article.status === ArticleStatus.PUBLISHED) {
      if (fs.existsSync(file.path)) {
        try { fs.unlinkSync(file.path); } catch { /* ignore */ }
      }
      throw new AppError(
        'Published articles cannot be edited directly. Please archive the article before modification.',
        400,
      );
    }

    if (article.coverImage && article.coverImage.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../../', article.coverImage);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch { /* ignore */ }
      }
    }

    const relativePath = `/uploads/articles/${file.filename}`;
    const updated = await articleRepository.updateById(articleId, {
      coverImage: relativePath,
    });

    if (!updated) {
      throw new AppError('Failed to update article cover image', 500);
    }

    return updated;
  }

  async uploadGalleryImages(
    articleId: string,
    userId: string,
    userRole: string,
    files?: Express.Multer.File[],
  ): Promise<IArticleDocument> {
    const uploadedFiles = files || [];
    if (uploadedFiles.length === 0) {
      throw new AppError('Please upload at least one image file', 400);
    }

    const cleanupFiles = () => {
      uploadedFiles.forEach((file) => {
        if (file && fs.existsSync(file.path)) {
          try { fs.unlinkSync(file.path); } catch { /* ignore */ }
        }
      });
    };

    const article = await articleRepository.findById(articleId);
    if (!article) {
      cleanupFiles();
      throw new AppError('Article not found', 404);
    }

    const isOwner = article.author && article.author.toString() === userId.toString();
    if (!isOwner && userRole !== UserRole.ADMIN) {
      cleanupFiles();
      throw new AppError('You are not authorized to update this article', 403);
    }

    if (article.status === ArticleStatus.PUBLISHED) {
      cleanupFiles();
      throw new AppError(
        'Published articles cannot be edited directly. Please archive the article before modification.',
        400,
      );
    }

    const currentImages = article.images || [];
    if (currentImages.length + uploadedFiles.length > 10) {
      cleanupFiles();
      throw new AppError(
        `An article can have a maximum of 10 gallery images. Currently has ${currentImages.length}, attempting to add ${uploadedFiles.length}.`,
        400,
      );
    }

    const newPaths = uploadedFiles.map((file) => `/uploads/articles/${file.filename}`);
    const updatedImages = [...currentImages, ...newPaths];

    const updated = await articleRepository.updateById(articleId, {
      images: updatedImages,
    });

    if (!updated) {
      throw new AppError('Failed to update article gallery images', 500);
    }

    return updated;
  }

  async publishArticle(articleId: string, userId: string, userRole: string): Promise<IArticleDocument> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    const isOwner = article.author && article.author.toString() === userId.toString();
    if (!isOwner && userRole !== UserRole.ADMIN) {
      throw new AppError('You are not authorized to publish this article', 403);
    }

    if (article.status !== ArticleStatus.DRAFT) {
      throw new AppError('Only draft articles can be published', 400);
    }

    const updated = await articleRepository.updateById(articleId, {
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
      archivedAt: null,
    });

    if (!updated) {
      throw new AppError('Failed to publish article', 500);
    }

    return updated;
  }

  async archiveArticle(articleId: string, userId: string, userRole: string): Promise<IArticleDocument> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new AppError('Article not found', 404);
    }

    const isOwner = article.author && article.author.toString() === userId.toString();
    if (!isOwner && userRole !== UserRole.ADMIN) {
      throw new AppError('You are not authorized to archive this article', 403);
    }

    if (article.status !== ArticleStatus.PUBLISHED) {
      throw new AppError('Only published articles can be archived', 400);
    }

    const updated = await articleRepository.updateById(articleId, {
      status: ArticleStatus.ARCHIVED,
      archivedAt: new Date(),
    });

    if (!updated) {
      throw new AppError('Failed to archive article', 500);
    }

    return updated;
  }
}

export default new ArticleService();
