import { Router } from 'express';
import categoryController from '../controllers/category.controller';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories (with pagination, search, and sorting)
 *     tags: [Categories]
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
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term (name or description)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', categoryController.getCategories);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get category detail by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category URL slug
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get('/categories/:slug', categoryController.getCategoryBySlug);

export default router;
