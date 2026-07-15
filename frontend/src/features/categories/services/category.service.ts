import axios from 'axios';
import api from '../../../services/api';
import type { ApiResponse } from '../../../types/auth.types';
import type {
  Category,
  CategoryQueryParams,
  CreateCategoryPayload,
  PaginatedCategoriesResponse,
  UpdateCategoryPayload,
} from '../../../types/category.types';

const extractApiError = (error: unknown, fallbackMessage: string): Error => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as {
      message?: string;
      errors?: Array<{ field?: string; message?: string }>;
    };

    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const firstErr = data.errors[0];
      return new Error(firstErr.message || data.message || fallbackMessage);
    }

    if (data.message) {
      return new Error(data.message);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(fallbackMessage);
};

class CategoryService {
  async getCategories(params?: CategoryQueryParams): Promise<PaginatedCategoriesResponse> {
    try {
      const response = await api.get<PaginatedCategoriesResponse>('/categories', {
        params,
      });
      return response.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch categories.');
    }
  }

  async getCategory(slug: string): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(`/categories/${encodeURIComponent(slug)}`);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch category details.');
    }
  }

  async createCategory(data: CreateCategoryPayload): Promise<Category> {
    try {
      const response = await api.post<ApiResponse<Category>>('/categories', data);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to create category.');
    }
  }

  async updateCategory(id: string, data: UpdateCategoryPayload): Promise<Category> {
    try {
      const response = await api.patch<ApiResponse<Category>>(`/categories/${encodeURIComponent(id)}`, data);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to update category.');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete<ApiResponse<null>>(`/categories/${encodeURIComponent(id)}`);
    } catch (error) {
      throw extractApiError(error, 'Failed to delete category.');
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;
