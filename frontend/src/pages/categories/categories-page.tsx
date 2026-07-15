import { Newspaper, Search, X, FolderSearch, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { useCategories, CategoryCard } from '../../features/categories';
import Spinner from '../../components/ui/spinner';

const CategoriesPage = () => {
  const { categories, pagination, isLoading, error, page, setPage, q, setQ } = useCategories({ initialLimit: 9 });

  return (
    <div className="min-h-screen bg-[#E3E1DE] text-[#353535] py-10 px-4 font-sans selection:bg-[#D74108] selection:text-white">
      {/* Editorial Masthead Header */}
      <header className="w-full max-w-6xl mx-auto mb-8">
        <div className="border-2 border-[#353535] bg-[#F9F8F6] p-6 sm:p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#353535] pb-3 mb-5 text-xs font-bold uppercase tracking-wider gap-2">
            <span className="flex items-center gap-1.5 text-[#D74108]">
              <Newspaper className="w-4 h-4" />
              <span>Paperio News Portal • Topic Directory</span>
            </span>
            <span className="font-mono text-[11px] bg-[#E3E1DE] px-2.5 py-0.5 rounded border border-[#353535]">
              {pagination ? `TOTAL TOPICS: ${pagination.total}` : 'ARCHIVE REPOSITORY'}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-[#353535]">
                Editorial Categories
              </h1>
              <p className="text-sm font-medium text-gray-600 font-sans mt-2 max-w-2xl leading-relaxed">
                Explore our comprehensive collection of investigative journalism, opinion columns, and specialized news dossiers curated by our global newsstand.
              </p>
            </div>

            {/* Brutalist Search Bar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search topic dossiers..."
                  className="w-full pl-10 pr-10 py-3 bg-white border-2 border-[#353535] rounded-xl font-sans text-sm font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-[#D74108] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] transition-all"
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-[#D74108] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto">
        {isLoading ? (
          /* Loading State */
          <div className="p-16 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] text-center my-6">
            <Spinner size="lg" />
            <p className="mt-4 font-serif font-bold text-lg text-[#353535] uppercase tracking-wide">
              Retrieving Topic Archives...
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-12 bg-[#F9F8F6] border-2 border-[#D74108] rounded-2xl shadow-[6px_6px_0px_0px_rgba(215,65,8,1)] text-center my-6">
            <p className="font-serif font-bold text-xl text-[#D74108] uppercase mb-2">Error Loading Archives</p>
            <p className="text-sm font-sans text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#D74108] text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:bg-[#b83606] transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="p-16 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] text-center my-6">
            <FolderSearch className="w-16 h-16 text-[#D74108] mx-auto mb-4 stroke-[1.5]" />
            <h3 className="font-serif font-black text-2xl uppercase text-[#353535]">No Matching Topics Found</h3>
            <p className="mt-2 text-sm text-gray-600 font-sans max-w-md mx-auto">
              {q
                ? `We couldn't find any category archives matching "${q}". Try using different keywords or clear your search filter.`
                : 'The editorial directory is currently empty. Please check back later or contact the editorial desk.'}
            </p>
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                className="mt-6 px-6 py-2.5 bg-[#353535] text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:bg-[#202020] transition-all"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          /* Grid Layout */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 p-4 bg-[#F9F8F6] border-2 border-[#353535] rounded-xl shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] flex items-center justify-between">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#353535] rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D74108] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] disabled:hover:bg-white disabled:hover:text-[#353535]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="font-mono text-xs font-bold text-[#353535] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D74108]" />
                  <span>PAGE {pagination.page} OF {pagination.totalPages}</span>
                </div>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(pagination.totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#353535] rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D74108] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] disabled:hover:bg-white disabled:hover:text-[#353535]"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoriesPage;
