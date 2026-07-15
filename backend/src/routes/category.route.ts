import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/category.validator';
import { UserRole } from '../types/enums';

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
 * /categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (2-100 chars)
 *               description:
 *                 type: string
 *                 description: Category description (optional, max 500 chars)
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       409:
 *         description: Category name or slug already exists
 */
router.post(
  '/categories',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  createCategoryValidator,
  categoryController.createCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update an existing category by ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (2-100 chars)
 *               description:
 *                 type: string
 *                 description: Category description (max 500 chars)
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name or slug already exists
 */
router.patch(
  '/categories/:id',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  updateCategoryValidator,
  categoryController.updateCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Category cannot be deleted if used by published articles or invalid ID
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Category not found
 */
router.delete(
  '/categories/:id',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  categoryIdValidator,
  categoryController.deleteCategory,
);

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
