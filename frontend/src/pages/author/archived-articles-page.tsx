import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { articleService, ArticleStatus, type Article } from '../../features/articles';
import { getMediaUrl } from '../../features/articles/components/article-card';
import useAuthStore from '../../store/auth.store';
import {
  Archive,
  ArrowLeft,
  Calendar,
  CheckCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Modal from '../../components/ui/modal';
import Spinner from '../../components/ui/spinner';

const ArchivedArticlesPage: React.FC = () => {
  const { currentUser: user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [archived, setArchived] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalArchived, setTotalArchived] = useState<number>(0);

  // Modal & action states
  const [restoreTarget, setRestoreTarget] = useState<Article | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchArchived = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await articleService.getArticles({
        status: ArticleStatus.ARCHIVED,
        author: isAdmin ? undefined : user?._id,
        q: searchQuery.trim() || undefined,
        page,
        limit: 10,
        sort: 'updatedAt',
        order: 'desc',
      });
      setArchived(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalArchived(res.meta?.total || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load archived articles.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?._id, searchQuery, page]);

  useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);

  const handleRestoreArticle = async () => {
    if (!restoreTarget) return;
    try {
      setIsRestoring(true);
      // Update article status back to DRAFT so author can review or republish
      await articleService.updateArticle(restoreTarget._id, {
        status: ArticleStatus.DRAFT,
      });
      setActionSuccess(`Story "${restoreTarget.title}" was restored to Drafts successfully.`);
      setRestoreTarget(null);
      fetchArchived();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to restore article.';
      setError(msg);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeletePermanently = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await articleService.deleteArticle(deleteTarget._id);
      setActionSuccess(`Archived story "${deleteTarget.title}" was deleted.`);
      setDeleteTarget(null);
      fetchArchived();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete archived article.';
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-[#353535]">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#353535] pb-6">
        <div>
          <Link
            to="/author"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#353535] hover:text-[#D74108] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editorial Desk
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 border border-[#353535] bg-[#353535] text-white">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-[#353535]">
                Archived Dispatches
              </h1>
              <p className="text-sm text-[#353535]/80 font-sans">
                Manage previously circulated or retired stories ({totalArchived} archived).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchArchived()}
            disabled={loading}
            className="flex items-center gap-2 border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-4 py-2.5 rounded-none"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {actionSuccess && (
        <div className="mb-6 flex items-center justify-between border border-[#353535] bg-emerald-100 p-4 text-emerald-900 font-bold">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="text-sm">{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs font-bold uppercase tracking-wider underline hover:text-emerald-950"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 border border-[#353535] bg-rose-100 p-4 text-rose-800 font-semibold">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-[#353535] bg-[#E8E5DF] p-4">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search archived title or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border border-[#353535] bg-[#F2EFE9] focus:bg-white rounded-none font-serif text-sm"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#353535]/60" />
        </div>
      </div>

      {/* Archived Table */}
      <div className="overflow-hidden border border-[#353535] bg-[#F2EFE9]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#353535] font-serif uppercase tracking-widest text-sm">
            <Spinner size="lg" className="text-[#353535]" />
            <p className="mt-4 font-bold">Retrieving archived dispatches...</p>
          </div>
        ) : archived.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-[#353535] bg-[#E8E5DF] text-[#353535]">
              <Archive className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-[#353535]">No archived stories</h3>
            <p className="mt-1 max-w-sm text-sm text-[#353535]/80 font-sans">
              {searchQuery
                ? 'No archived articles match your query.'
                : 'You have no archived stories. When you archive published articles, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#353535] bg-[#E8E5DF] text-xs font-bold uppercase tracking-wider text-[#353535]">
                  <th className="py-4 px-6">Archived Story</th>
                  <th className="py-4 px-6">Categories</th>
                  <th className="py-4 px-6">Archived On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#353535]/20 text-sm">
                {archived.map((item) => {
                  const coverUrl = getMediaUrl(item.coverImage);
                  const archivedDate = new Date(item.archivedAt || item.updatedAt || item.createdAt).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' },
                  );

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-white/60"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={coverUrl}
                            alt={item.title}
                            className="h-14 w-20 flex-shrink-0 object-cover border border-[#353535] bg-[#E8E5DF]"
                          />
                          <div>
                            <span className="font-serif font-bold text-[#353535] line-clamp-1">
                              {item.title}
                            </span>
                            <p className="mt-0.5 text-xs text-[#353535]/70 line-clamp-1 max-w-md font-sans">
                              {item.excerpt || 'No excerpt provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {item.categories && item.categories.length > 0 ? (
                            item.categories.slice(0, 2).map((cat, idx) => (
                              <span
                                key={idx}
                                className="border border-[#353535] bg-[#E8E5DF] px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#353535]"
                              >
                                {typeof cat === 'object' && cat !== null ? cat.name : cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic text-[#353535]/60">Uncategorized</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs font-mono text-[#353535]/80">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#353535]/60" />
                          {archivedDate}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRestoreTarget(item)}
                            className="flex items-center gap-1.5 border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-3 py-1.5 rounded-none"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restore to Draft
                          </Button>

                          {isAdmin && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 border border-[#353535] bg-rose-600 text-white hover:bg-rose-700 rounded-none"
                              title="Permanently Delete (Admin Only)"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#353535] bg-[#E8E5DF] px-6 py-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#353535]">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-3 py-1 rounded-none disabled:opacity-40"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-3 py-1 rounded-none disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        title="Restore Archived Article"
      >
        <div className="space-y-4 font-sans text-[#353535]">
          <p className="text-sm">
            Are you sure you want to restore{' '}
            <span className="font-serif font-bold text-[#353535]">
              "{restoreTarget?.title}"
            </span>{' '}
            to <span className="font-bold uppercase tracking-wider text-[#D74108]">Drafts</span>? You can edit and republish it from the Draft Management page.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#353535]">
            <Button
              variant="outline"
              onClick={() => setRestoreTarget(null)}
              disabled={isRestoring}
              className="border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRestoreArticle}
              disabled={isRestoring}
              className="flex items-center gap-2 border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              {isRestoring && <Spinner size="sm" className="text-white" />}
              {isRestoring ? 'Restoring...' : 'Yes, Restore to Drafts'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Permanent Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Permanently Delete Article (Admin Only)"
      >
        <div className="space-y-4 font-sans text-[#353535]">
          <p className="text-sm">
            <strong className="text-rose-600 font-bold uppercase tracking-wider">Warning:</strong> You are about to permanently delete{' '}
            <span className="font-serif font-bold text-[#353535]">
              "{deleteTarget?.title}"
            </span>
            . This action will remove the article from the database completely.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#353535]">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePermanently}
              disabled={isDeleting}
              className="flex items-center gap-2 border border-[#353535] bg-rose-600 hover:bg-rose-700 text-white uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              {isDeleting && <Spinner size="sm" className="text-white" />}
              {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArchivedArticlesPage;
