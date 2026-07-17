import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/category.service';
import type { Category, CategoryPaginationMeta } from '../../../types/category.types';

interface UseCategoriesOptions {
  initialLimit?: number;
}

export const useCategories = (options?: UseCategoriesOptions) => {
  const limit = options?.initialLimit ?? 9;
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<CategoryPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1); // Reset page on new search
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await categoryService.getCategories({
        page,
        limit,
        q: debouncedQ,
        sort: 'name',
        order: 'asc',
      });
      setCategories(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load categories';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedQ]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    q,
    setQ,
    refetch: fetchCategories,
  };
};

export default useCategories;
