import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { updateProfileValidator } from '../validators/user.validator';
import { uploadAvatarMiddleware } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/users/profile', authMiddleware, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               socialLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platform:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       409:
 *         description: Username already taken
 */
router.patch(
  '/users/profile',
  authMiddleware,
  updateProfileValidator,
  userController.updateProfile,
);

/**
 * @swagger
 * /users/profile/avatar:
 *   patch:
 *     summary: Upload and update user profile avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid file type or no file provided
 *       401:
 *         description: Not authorized
 */
router.patch(
  '/users/profile/avatar',
  authMiddleware,
  uploadAvatarMiddleware.single('avatar'),
  userController.uploadAvatar,
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user public profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Public user profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:id', userController.getPublicProfile);

export default router;
