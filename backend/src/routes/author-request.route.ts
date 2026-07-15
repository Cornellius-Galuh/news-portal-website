import { Router } from 'express';
import authorRequestController from '../controllers/author-request.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { becomeAuthorValidator, requestIdValidator } from '../validators/author-request.validator';
import { UserRole } from '../types/enums';

const router = Router();

/**
 * @swagger
 * /users/become-author:
 *   post:
 *     summary: Submit a request to become an author
 *     tags: [Author Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for wanting to become an author (10-500 chars)
 *     responses:
 *       201:
 *         description: Author request submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Only users with USER role can submit
 *       409:
 *         description: Pending request already exists
 */
router.get('/users/become-author', authMiddleware, authorRequestController.getMyRequest);

router.post(
  '/users/become-author',
  authMiddleware,
  becomeAuthorValidator,
  authorRequestController.becomeAuthor,
);

/**
 * @swagger
 * /author-requests:
 *   get:
 *     summary: Get all author requests (Admin only)
 *     tags: [Author Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter author requests by status
 *     responses:
 *       200:
 *         description: Author requests retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  '/author-requests',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  authorRequestController.getAllRequests,
);

/**
 * @swagger
 * /author-requests/{id}/approve:
 *   patch:
 *     summary: Approve an author request and upgrade user to AUTHOR role (Admin only)
 *     tags: [Author Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author request ID
 *     responses:
 *       200:
 *         description: Author request approved successfully
 *       400:
 *         description: Request is not in PENDING state or invalid ID
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Author request not found
 */
router.patch(
  '/author-requests/:id/approve',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  requestIdValidator,
  authorRequestController.approveRequest,
);

/**
 * @swagger
 * /author-requests/{id}/reject:
 *   patch:
 *     summary: Reject an author request (Admin only)
 *     tags: [Author Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author request ID
 *     responses:
 *       200:
 *         description: Author request rejected successfully
 *       400:
 *         description: Request is not in PENDING state or invalid ID
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Author request not found
 */
router.patch(
  '/author-requests/:id/reject',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  requestIdValidator,
  authorRequestController.rejectRequest,
);

export default router;
