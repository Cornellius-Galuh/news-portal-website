import { Router } from 'express';
import articleController from '../controllers/article.controller';
import authMiddleware, { optionalAuthMiddleware } from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import {
  uploadArticleCoverMiddleware,
  uploadArticleImagesMiddleware,
} from '../middlewares/upload.middleware';
import {
  articleIdValidator,
  createArticleValidator,
  updateArticleValidator,
} from '../validators/article.validator';
import { UserRole } from '../types/enums';

const router = Router();

/**
 * @swagger
 * /articles/trending:
 *   get:
 *     summary: Get trending published articles based on views, likes, and comments
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Trending articles retrieved successfully
 */
router.get('/articles/trending', articleController.getTrendingArticles);

/**
 * @swagger
 * /articles/latest:
 *   get:
 *     summary: Get latest published articles sorted by publishedAt
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Latest articles retrieved successfully
 */
router.get('/articles/latest', articleController.getLatestArticles);

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles with pagination, sorting, search, and filtering
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: desc
 *         description: Sort order (asc or desc)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query matching title, excerpt, and content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (DRAFT, PUBLISHED, ARCHIVED)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *         description: Filter publishedAt greater than or equal to fromDate
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *         description: Filter publishedAt less than or equal to toDate
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 */
router.get('/articles', articleController.getArticles);

/**
 * @swagger
 * /articles/slug/{slug}:
 *   get:
 *     summary: Get article detail by slug (automatically records view with deduplication)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *       404:
 *         description: Article not found
 */
router.get('/articles/slug/:slug', optionalAuthMiddleware, articleController.getArticleDetail);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get article detail by ID (automatically records view with deduplication)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article MongoDB ID
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *       404:
 *         description: Article not found
 */
router.get('/articles/:id', optionalAuthMiddleware, articleIdValidator, articleController.getArticleById);

/**
 * @swagger
 * /articles/{id}/view:
 *   post:
 *     summary: Explicitly record view counter for an article with deduplication
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article view recorded successfully
 */
router.post('/articles/:id/view', optionalAuthMiddleware, articleController.recordArticleView);

/**
 * @swagger
 * /articles/{id}/like:
 *   post:
 *     summary: Toggle article like by authenticated user
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article like toggled successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/articles/:id/like', authMiddleware, articleIdValidator, articleController.toggleArticleLike);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article (default status DRAFT)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - excerpt
 *               - content
 *               - categories
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Article created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - AUTHOR or ADMIN only
 */
router.post(
  '/articles',
  authMiddleware,
  roleMiddleware(UserRole.AUTHOR, UserRole.ADMIN),
  createArticleValidator,
  articleController.createArticle,
);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Update an existing draft or archived article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: Bad request (e.g. attempting to edit published article)
 *       403:
 *         description: Forbidden - Not the article author
 */
router.patch(
  '/articles/:id',
  authMiddleware,
  updateArticleValidator,
  articleController.updateArticle,
);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Soft delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       403:
 *         description: Forbidden - Not the article author
 */
router.delete(
  '/articles/:id',
  authMiddleware,
  articleIdValidator,
  articleController.deleteArticle,
);

/**
 * @swagger
 * /articles/{id}/cover:
 *   patch:
 *     summary: Upload and update cover image for an article (replaces previous image)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Article cover image updated successfully
 */
router.patch(
  '/articles/:id/cover',
  authMiddleware,
  articleIdValidator,
  uploadArticleCoverMiddleware,
  articleController.uploadCoverImage,
);

/**
 * @swagger
 * /articles/{id}/images:
 *   patch:
 *     summary: Upload multiple gallery images for an article (maximum 10 total images)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Article gallery images updated successfully
 */
router.patch(
  '/articles/:id/images',
  authMiddleware,
  articleIdValidator,
  uploadArticleImagesMiddleware,
  articleController.uploadGalleryImages,
);

/**
 * @swagger
 * /articles/{id}/publish:
 *   patch:
 *     summary: Publish a draft article (sets status PUBLISHED and publishedAt automatically)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article published successfully
 *       400:
 *         description: Only draft articles can be published
 */
router.patch(
  '/articles/:id/publish',
  authMiddleware,
  articleIdValidator,
  articleController.publishArticle,
);

/**
 * @swagger
 * /articles/{id}/archive:
 *   patch:
 *     summary: Archive a published article (sets status ARCHIVED and archivedAt automatically)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article archived successfully
 *       400:
 *         description: Only published articles can be archived
 */
router.patch(
  '/articles/:id/archive',
  authMiddleware,
  articleIdValidator,
  articleController.archiveArticle,
);

export default router;
