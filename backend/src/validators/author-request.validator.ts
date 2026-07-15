import { body, param } from 'express-validator';
import { validate } from './auth.validator';

export const becomeAuthorValidator = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),

  validate,
];

export const requestIdValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Author request ID is required')
    .isMongoId()
    .withMessage('Invalid author request ID format'),

  validate,
];
