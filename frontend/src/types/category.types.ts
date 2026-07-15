export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface CategoryPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: CategoryPaginationMeta;
}
