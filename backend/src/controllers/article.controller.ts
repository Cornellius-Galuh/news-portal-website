import { Request, Response } from 'express';
import articleService from '../services/article.service';
import { sendCreated, sendPaginated, sendSuccess } from '../utils/api-response';

class ArticleController {
  async createArticle(req: Request, res: Response): Promise<void> {
    const { title, excerpt, content, categories, tags } = req.body;
    const author = req.user?._id?.toString() || '';

    const article = await articleService.createArticle({
      title,
      excerpt,
      content,
      categories,
      tags,
      author,
    });

    sendCreated(res, article, 'Article created successfully');
  }

  async getArticles(req: Request, res: Response): Promise<void> {
    const { page, limit, sort, order, author, status, category, q, fromDate, toDate } = req.query;

    const result = await articleService.getArticles({
      page: page !== undefined ? Number(page) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      sort: typeof sort === 'string' ? sort : undefined,
      order: typeof order === 'string' ? order : undefined,
      author: typeof author === 'string' ? author : undefined,
      status: typeof status === 'string' ? status : undefined,
      category: typeof category === 'string' ? category : undefined,
      q: typeof q === 'string' ? q : undefined,
      fromDate: typeof fromDate === 'string' ? fromDate : undefined,
      toDate: typeof toDate === 'string' ? toDate : undefined,
    });

    sendPaginated(res, result.data, result.pagination, 'Articles retrieved successfully');
  }

  async getLatestArticles(req: Request, res: Response): Promise<void> {
    const { limit } = req.query;
    const limitNum = limit !== undefined ? Number(limit) : 10;
    const articles = await articleService.getLatestArticles(limitNum);

    sendSuccess(res, articles, 'Latest articles retrieved successfully');
  }

  async getTrendingArticles(req: Request, res: Response): Promise<void> {
    const { limit } = req.query;
    const limitNum = limit !== undefined ? Number(limit) : 10;
    const articles = await articleService.getTrendingArticles(limitNum);

    sendSuccess(res, articles, 'Trending articles retrieved successfully');
  }

  async getArticleById(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || null;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    // Trigger view counter checking time window
    const article = await articleService.getArticleDetail(id, { userId, ipAddress });

    sendSuccess(res, article, 'Article retrieved successfully');
  }

  async getArticleDetail(req: Request, res: Response): Promise<void> {
    const param = req.params.slug || req.params.id || '';
    const idOrSlug = typeof param === 'string' ? param : Array.isArray(param) ? param[0] : '';
    const userId = req.user?._id?.toString() || null;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const article = await articleService.getArticleDetail(idOrSlug, { userId, ipAddress });

    sendSuccess(res, article, 'Article detail retrieved successfully');
  }

  async recordArticleView(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id || req.params.slug;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || null;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    await articleService.recordArticleView(id, { userId, ipAddress });

    sendSuccess(res, null, 'Article view recorded successfully');
  }

  async toggleArticleLike(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';

    const result = await articleService.toggleArticleLike(id, userId);

    sendSuccess(res, result, result.liked ? 'Article liked successfully' : 'Article unliked successfully');
  }

  async updateArticle(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';
    const userRole = req.user?.role || '';
    const { title, excerpt, content, categories, tags, status } = req.body;

    const article = await articleService.updateArticle(id, userId, userRole, {
      title,
      excerpt,
      content,
      categories,
      tags,
      status,
    });

    sendSuccess(res, article, 'Article updated successfully');
  }

  async deleteArticle(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';
    const userRole = req.user?.role || '';

    await articleService.deleteArticle(id, userId, userRole);

    sendSuccess(res, null, 'Article deleted successfully');
  }

  async uploadCoverImage(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';
    const userRole = req.user?.role || '';
    const file = req.file;

    const article = await articleService.uploadCoverImage(id, userId, userRole, file);

    sendSuccess(res, article, 'Article cover image updated successfully');
  }

  async uploadGalleryImages(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';
    const userRole = req.user?.role || '';
    const files = req.files as Express.Multer.File[] | undefined;

    const article = await articleService.uploadGalleryImages(id, userId, userRole, files);

    sendSuccess(res, article, 'Article gallery images updated successfully');
  }

  async publishArticle(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';
    const userRole = req.user?.role || '';

    const article = await articleService.publishArticle(id, userId, userRole);

    sendSuccess(res, article, 'Article published successfully');
  }

  async archiveArticle(req: Request, res: Response): Promise<void> {
    const idParam = req.params.id;
    const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
    const userId = req.user?._id?.toString() || '';
    const userRole = req.user?.role || '';

    const article = await articleService.archiveArticle(id, userId, userRole);

    sendSuccess(res, article, 'Article archived successfully');
  }
}

export default new ArticleController();
