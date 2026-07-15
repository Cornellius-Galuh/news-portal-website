import { Types } from 'mongoose';
import categoryRepository, { PaginatedCategoriesResult } from '../repositories/category.repository';
import AppError from '../utils/app-error';
import { ICategoryDocument } from '../interfaces/category.interface';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

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

  async createCategory(data: {
    name: string;
    description?: string;
    createdBy?: Types.ObjectId;
  }): Promise<ICategoryDocument> {
    const existingName = await categoryRepository.findByName(data.name);
    if (existingName) {
      throw new AppError('Category name already exists.', 409);
    }

    const slug = generateSlug(data.name) || `category-${Date.now()}`;
    const existingSlug = await categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new AppError('Category slug already exists.', 409);
    }

    return categoryRepository.create({
      name: data.name.trim(),
      slug,
      description: data.description ? data.description.trim() : '',
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      updatedBy?: Types.ObjectId;
    },
  ): Promise<ICategoryDocument> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    const updatePayload: Partial<ICategoryDocument> = {
      updatedBy: data.updatedBy,
    };

    if (data.name && data.name.trim() !== category.name) {
      const trimmedName = data.name.trim();
      const existingName = await categoryRepository.findByName(trimmedName);
      if (existingName && existingName._id.toString() !== id) {
        throw new AppError('Category name already exists.', 409);
      }

      const newSlug = generateSlug(trimmedName) || `category-${Date.now()}`;
      const existingSlug = await categoryRepository.findBySlug(newSlug);
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new AppError('Category slug already exists.', 409);
      }

      updatePayload.name = trimmedName;
      updatePayload.slug = newSlug;
    }

    if (data.description !== undefined) {
      updatePayload.description = data.description.trim();
    }

    const updated = await categoryRepository.updateById(id, updatePayload);
    if (!updated) {
      throw new AppError('Failed to update category.', 500);
    }

    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    const articleCount = await categoryRepository.countPublishedArticlesByCategoryId(id);
    if (articleCount > 0) {
      throw new AppError(
        'Category cannot be deleted because it is currently used by one or more published articles.',
        400,
      );
    }

    await categoryRepository.deleteById(id);
  }
}

export default new CategoryService();
