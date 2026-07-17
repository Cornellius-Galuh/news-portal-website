import axios from 'axios';
import api from '../../../services/api';
import type { ApiResponse } from '../../../types/auth.types';
import type {
  Article,
  CreateArticlePayload,
  UpdateArticlePayload,
  ArticleQueryParams,
  PaginatedArticlesResponse,
} from '../types/article.types';

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

class ArticleService {
  async createArticle(data: CreateArticlePayload): Promise<Article> {
    try {
      const response = await api.post<ApiResponse<Article>>('/articles', data);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to create article.');
    }
  }

  async updateArticle(id: string, data: UpdateArticlePayload): Promise<Article> {
    try {
      const response = await api.patch<ApiResponse<Article>>(`/articles/${encodeURIComponent(id)}`, data);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to update article.');
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      await api.delete<ApiResponse<null>>(`/articles/${encodeURIComponent(id)}`);
    } catch (error) {
      throw extractApiError(error, 'Failed to delete article.');
    }
  }

  async uploadCover(id: string, file: File): Promise<Article> {
    try {
      const formData = new FormData();
      formData.append('coverImage', file);

      const response = await api.patch<ApiResponse<Article>>(
        `/articles/${encodeURIComponent(id)}/cover`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to upload cover image.');
    }
  }

  async uploadImages(id: string, files: File[]): Promise<Article> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.patch<ApiResponse<Article>>(
        `/articles/${encodeURIComponent(id)}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to upload gallery images.');
    }
  }

  async publishArticle(id: string): Promise<Article> {
    try {
      const response = await api.patch<ApiResponse<Article>>(`/articles/${encodeURIComponent(id)}/publish`);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to publish article.');
    }
  }

  async archiveArticle(id: string): Promise<Article> {
    try {
      const response = await api.patch<ApiResponse<Article>>(`/articles/${encodeURIComponent(id)}/archive`);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to archive article.');
    }
  }

  async getArticleById(id: string): Promise<Article> {
    try {
      const response = await api.get<ApiResponse<Article>>(`/articles/${encodeURIComponent(id)}`);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch article details.');
    }
  }

  async getArticles(params?: ArticleQueryParams): Promise<PaginatedArticlesResponse> {
    try {
      const response = await api.get<{ data: Article[]; pagination?: { total: number; page: number; limit: number; totalPages: number }; meta?: { total: number; page: number; limit: number; totalPages: number } }>('/articles', { params });
      const pagination = response.data.pagination || response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
      return {
        data: response.data.data,
        meta: pagination,
      };
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch articles.');
    }
  }

  async getTrendingArticles(limit: number = 10): Promise<Article[]> {
    try {
      const response = await api.get<ApiResponse<Article[]>>('/articles/trending', {
        params: { limit },
      });
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch trending articles.');
    }
  }

  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    try {
      const response = await api.get<ApiResponse<Article[]>>('/articles/latest', {
        params: { limit },
      });
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch latest articles.');
    }
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    try {
      const response = await api.get<ApiResponse<Article>>(`/articles/slug/${encodeURIComponent(slug)}`);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to fetch article details.');
    }
  }

  async toggleLike(id: string): Promise<{ liked: boolean; likeCount: number }> {
    try {
      const response = await api.post<ApiResponse<{ liked: boolean; likeCount: number }>>(`/articles/${encodeURIComponent(id)}/like`);
      return response.data.data;
    } catch (error) {
      throw extractApiError(error, 'Failed to toggle like on article.');
    }
  }

  async recordView(id: string): Promise<void> {
    try {
      await api.post(`/articles/${encodeURIComponent(id)}/view`);
    } catch (error) {
      // Suppress view recording errors on frontend
      console.error('Failed to record view:', error);
    }
  }
}

export const articleService = new ArticleService();
export default articleService;
