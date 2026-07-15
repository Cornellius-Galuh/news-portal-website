import { body } from 'express-validator';
import { validate } from './auth.validator';

export const updateProfileValidator = [
  body('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Username cannot be empty')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be at most 500 characters'),

  body('socialLinks').optional().isArray().withMessage('Social links must be an array of objects'),

  body('socialLinks.*.platform')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Platform name is required'),

  body('socialLinks.*.url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Please provide a valid URL for social links'),

  validate,
];
