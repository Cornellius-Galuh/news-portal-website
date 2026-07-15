import { body, param } from 'express-validator';
import { validate } from './auth.validator';

export const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  validate,
];

export const updateCategoryValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty when provided')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  validate,
];

export const categoryIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  validate,
];
