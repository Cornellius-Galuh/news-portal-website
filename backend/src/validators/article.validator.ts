import { body, param } from 'express-validator';
import { validate } from './auth.validator';

export const createArticleValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Article title is required')
    .isLength({ min: 5, max: 250 })
    .withMessage('Article title must be between 5 and 250 characters'),

  body('excerpt')
    .trim()
    .notEmpty()
    .withMessage('Article excerpt is required')
    .isLength({ max: 500 })
    .withMessage('Article excerpt must be at most 500 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Article content is required'),

  body('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category is required'),

  body('categories.*')
    .isMongoId()
    .withMessage('Each category must be a valid MongoDB ID'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),

  body('tags.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each tag must be a non-empty string'),

  validate,
];

export const updateArticleValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Article ID is required')
    .isMongoId()
    .withMessage('Invalid article ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Article title cannot be empty when provided')
    .isLength({ min: 5, max: 250 })
    .withMessage('Article title must be between 5 and 250 characters'),

  body('excerpt')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Article excerpt cannot be empty when provided')
    .isLength({ max: 500 })
    .withMessage('Article excerpt must be at most 500 characters'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Article content cannot be empty when provided'),

  body('categories')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one category is required when updating categories'),

  body('categories.*')
    .optional()
    .isMongoId()
    .withMessage('Each category must be a valid MongoDB ID'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),

  body('tags.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each tag must be a non-empty string'),

  body('images')
    .optional()
    .isArray({ max: 25 })
    .withMessage('Images must be an array of up to 25 image paths/URLs'),

  body('images.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each image entry must be a valid path/URL string'),

  body('coverImage')
    .optional()
    .isString()
    .trim()
    .withMessage('Cover image must be a valid path/URL string'),

  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .withMessage('Status must be either DRAFT, PUBLISHED, or ARCHIVED'),

  validate,
];

export const articleIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Article ID is required')
    .isMongoId()
    .withMessage('Invalid article ID format'),

  validate,
];
