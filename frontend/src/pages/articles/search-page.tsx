import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { articleService, ArticleStatus, type Article } from '../../features/articles';
import ArticleCard from '../../features/articles/components/article-card';
import { categoryService, type Category } from '../../features/categories';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import Spinner from '../../components/ui/spinner';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>((searchParams.get('order') as 'asc' | 'desc') || 'desc');
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  useEffect(() => {
    categoryService
      .getCategories({ limit: 50 })
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch(() => {});
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await articleService.getArticles({
        q: query.trim() || undefined,
        category: category || undefined,
        sort,
        order,
        status: ArticleStatus.PUBLISHED,
        page,
        limit: 9,
      });

      setArticles(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalArticles(res.meta?.total || 0);

      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category) params.set('category', category);
      if (sort !== 'createdAt') params.set('sort', sort);
      if (order !== 'desc') params.set('order', order);
      if (page > 1) params.set('page', page.toString());

      setSearchParams(params, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to perform search.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [query, category, sort, order, page, setSearchParams]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchResults();
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('');
    setSort('createdAt');
    setOrder('desc');
    setPage(1);
  };

  return (
    <div className="border border-[#353535] bg-[#E8E5DF] text-[#353535]">
      {/* Header */}
      <div className="border-b border-[#353535] bg-[#F2EFE9] p-6 sm:p-10">
        <h1 className="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#353535]">
          InfoSalatiga Archives
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#353535]/80 font-sans max-w-2xl">
          Search breaking headlines, filter stories by specific categories, and sort through our complete historical publishing records.
        </p>
      </div>

      {/* Form Container */}
      <div className="border-b border-[#353535] bg-[#E8E5DF] p-6">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search keywords, headlines, or investigative reports..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-[#353535] bg-[#F2EFE9] pl-10 pr-10 py-3 font-serif text-base focus:outline-none focus:bg-white transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-[#353535]/60" />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setPage(1);
                  }}
                  className="absolute right-3.5 top-3.5 text-[#353535]/60 hover:text-[#D74108]"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="border border-[#353535] bg-[#353535] text-white px-8 py-3 uppercase text-xs font-bold tracking-wider hover:bg-[#D74108] hover:border-[#D74108] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#353535]/30 pt-4 text-xs font-semibold uppercase tracking-wider">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-[#D74108]" />
                <span>Category:</span>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="border border-[#353535] bg-[#F2EFE9] px-3 py-1 font-sans focus:outline-none focus:bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#D74108]" />
                <span>Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="border border-[#353535] bg-[#F2EFE9] px-3 py-1 font-sans focus:outline-none focus:bg-white"
                >
                  <option value="createdAt">Publish Date</option>
                  <option value="viewCount">Most Viewed</option>
                  <option value="likeCount">Most Liked</option>
                </select>
                <select
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value as 'asc' | 'desc');
                    setPage(1);
                  }}
                  className="border border-[#353535] bg-[#F2EFE9] px-3 py-1 font-sans focus:outline-none focus:bg-white"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {(query || category || sort !== 'createdAt' || order !== 'desc') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[#D74108] underline hover:text-[#353535] font-bold"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="p-6 sm:p-8">
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#353535]/80 border-b border-[#353535]/30 pb-3">
            <span>
              Showing <strong className="text-[#353535] font-black">{totalArticles}</strong> Records
              {query && ` matching "${query}"`}
            </span>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#F2EFE9]">
            <Spinner size="lg" />
            <p className="mt-4 font-serif text-lg font-bold uppercase tracking-wider">Searching Archives...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center border border-rose-300 bg-rose-50 text-rose-800">
            <p className="font-bold">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="border border-[#353535] bg-[#F2EFE9] p-16 text-center">
            <h3 className="font-serif text-2xl font-bold uppercase text-[#353535]">No Stories Found</h3>
            <p className="mt-2 text-sm text-[#353535]/70 max-w-md mx-auto font-sans">
              No matching records exist in our current publishing database. Try broadening your keywords or resetting filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 border border-[#353535] bg-[#353535] text-white px-6 py-2 uppercase text-xs font-bold rounded-none hover:bg-[#D74108]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art._id} article={art} variant="normal" className="h-full" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex items-center justify-center gap-4 border-t border-[#353535] pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border border-[#353535] bg-[#F2EFE9] px-6 py-2 uppercase text-xs font-bold disabled:opacity-40 hover:bg-[#353535] hover:text-white transition-colors"
            >
              ← Previous
            </button>
            <span className="font-serif font-bold text-sm">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="border border-[#353535] bg-[#F2EFE9] px-6 py-2 uppercase text-xs font-bold disabled:opacity-40 hover:bg-[#353535] hover:text-white transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
