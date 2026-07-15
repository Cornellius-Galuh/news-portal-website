import categoryRepository, { PaginatedCategoriesResult } from '../repositories/category.repository';
import AppError from '../utils/app-error';
import { ICategoryDocument } from '../interfaces/category.interface';

class CategoryService {
  async getCategories(query: {
    page?: number;
    limit?: number;
    q?: string;
    sort?: string;
    order?: string;
  }): Promise<PaginatedCategoriesResult> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const q = typeof query.q === 'string' ? query.q : '';
    const sort = typeof query.sort === 'string' ? query.sort : 'name';
    const order = typeof query.order === 'string' ? query.order : 'asc';

    return categoryRepository.findPaginated({ page, limit, q, sort, order });
  }

  async getCategoryBySlug(slug: string): Promise<ICategoryDocument & { articleCount: number }> {
    if (!slug || slug.trim() === '') {
      throw new AppError('Category slug is required.', 400);
    }

    const category = await categoryRepository.findBySlug(slug.trim());
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    return category;
  }
}

export default new CategoryService();
