import { Request, Response } from 'express';
import categoryService from '../services/category.service';
import { sendPaginated, sendSuccess } from '../utils/api-response';

class CategoryController {
  async getCategories(req: Request, res: Response): Promise<void> {
    const { page, limit, q, sort, order } = req.query;

    const result = await categoryService.getCategories({
      page: page !== undefined ? Number(page) : 1,
      limit: limit !== undefined ? Number(limit) : 10,
      q: typeof q === 'string' ? q : '',
      sort: typeof sort === 'string' ? sort : 'name',
      order: typeof order === 'string' ? order : 'asc',
    });

    sendPaginated(res, result.data, result.pagination, 'Categories retrieved successfully');
  }

  async getCategoryBySlug(req: Request, res: Response): Promise<void> {
    const slugParam = req.params.slug;
    const slug = typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] : '';
    const category = await categoryService.getCategoryBySlug(slug);

    sendSuccess(res, category, 'Category retrieved successfully');
  }
}

export default new CategoryController();
