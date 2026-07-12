import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = (
  res: Response,
  data: unknown = null,
  message: string = 'Success',
  statusCode: number = 200,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = (
  res: Response,
  data: unknown = null,
  message: string = 'Created successfully',
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendPaginated = (
  res: Response,
  data: unknown[],
  pagination: PaginationMeta,
  message: string = 'Success',
): void => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export const sendError = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  errors: unknown[] = [],
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
