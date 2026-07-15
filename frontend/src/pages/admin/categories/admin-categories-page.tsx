import { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
} from 'lucide-react';
import {
  useCategories,
  CategoryFormModal,
  DeleteCategoryModal,
  type Category,
} from '../../../features/categories';
import Spinner from '../../../components/ui/spinner';

const AdminCategoriesPage = () => {
  const { categories, pagination, isLoading, error, page, setPage, q, setQ, refetch } =
    useCategories({ initialLimit: 10 });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  return (
    <div className="w-full text-[#353535] font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#353535]">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#D74108]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Topic Category Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1">
            Create, edit, and audit newsstand classifications. Protected by editorial safety checks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D74108] text-white font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#353535] shadow-[4px_4px_0px_0px_rgba(53,53,53,1)] hover:bg-[#b83606] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-[#353535] rounded-xl font-sans text-sm font-semibold placeholder:text-gray-400 focus:outline-none focus:border-[#D74108] shadow-[2px_2px_0px_0px_rgba(53,53,53,1)] transition-all"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#D74108] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {pagination && (
          <span className="font-mono text-xs font-bold px-3 py-1.5 bg-[#E3E1DE] border border-[#353535] rounded-lg">
            TOTAL CLASSIFICATIONS: {pagination.total}
          </span>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center">
            <Spinner size="lg" />
            <p className="mt-4 font-serif font-bold text-base text-[#353535] uppercase">
              Loading Directory Table...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            <p className="font-serif font-bold text-lg uppercase mb-2">Error Loading Table</p>
            <p className="text-sm font-sans mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-[#353535] text-white font-bold text-xs uppercase rounded-lg border border-[#353535]"
            >
              Retry Fetch
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center">
            <FolderOpen className="w-12 h-12 text-[#D74108] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="font-serif font-bold text-xl uppercase">No Categories Found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {q
                ? `No topic classifications match "${q}". Clear the search query or click create above.`
                : 'Your newsstand directory currently has zero topic classifications.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F8F6] border-b-2 border-[#353535] text-xs font-black uppercase tracking-wider text-[#353535]">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Description</th>
                  <th className="py-3.5 px-4 text-center">Articles</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Created At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm font-medium text-[#353535]">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#F9F8F6]/60 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-4 font-bold">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-[#D74108] shrink-0" />
                        <span>{cat.name}</span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[#353535]">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 hidden md:table-cell max-w-xs truncate text-gray-600 text-xs">
                      {cat.description || <span className="italic text-gray-400">No description</span>}
                    </td>

                    {/* Articles count */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E3E1DE] border border-[#353535] rounded-full font-mono text-xs font-bold">
                        <BookOpen className="w-3 h-3 text-[#D74108]" />
                        <span>{cat.articleCount ?? 0}</span>
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="py-4 px-4 hidden sm:table-cell text-xs text-gray-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {cat.createdAt
                            ? new Date(cat.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(cat)}
                          className="p-2 bg-white border border-[#353535] rounded-lg text-gray-700 hover:bg-[#353535] hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]"
                          title="Edit Category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCategory(cat)}
                          className="p-2 bg-white border border-[#353535] rounded-lg text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 bg-[#F9F8F6] border-t-2 border-[#353535] flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border-2 border-[#353535] rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D74108] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="font-mono text-xs font-bold text-[#353535]">
              PAGE {pagination.page} OF {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border-2 border-[#353535] rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D74108] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={isCreateOpen || Boolean(editingCategory)}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={refetch}
        initialData={editingCategory}
      />

      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onSuccess={refetch}
        category={deletingCategory}
      />
    </div>
  );
};

export default AdminCategoriesPage;
