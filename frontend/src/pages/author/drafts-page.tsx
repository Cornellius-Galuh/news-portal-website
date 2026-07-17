import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { articleService, ArticleStatus, type Article } from '../../features/articles';
import { getMediaUrl } from '../../features/articles/components/article-card';
import useAuthStore from '../../store/auth.store';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Modal from '../../components/ui/modal';
import Spinner from '../../components/ui/spinner';

const DraftsPage: React.FC = () => {
  const { currentUser: user } = useAuthStore();
  const navigate = useNavigate();

  const [drafts, setDrafts] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDrafts, setTotalDrafts] = useState<number>(0);

  // Modal & action states
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [publishTarget, setPublishTarget] = useState<Article | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await articleService.getArticles({
        status: ArticleStatus.DRAFT,
        author: user?.role === 'ADMIN' ? undefined : user?._id,
        q: searchQuery.trim() || undefined,
        page,
        limit: 10,
        sort: 'updatedAt',
        order: 'desc',
      });
      setDrafts(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalDrafts(res.meta?.total || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load drafts.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?._id, user?.role, searchQuery, page]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleDeleteDraft = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await articleService.deleteArticle(deleteTarget._id);
      setActionSuccess(`Draft "${deleteTarget.title}" was deleted successfully.`);
      setDeleteTarget(null);
      fetchDrafts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete draft.';
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublishDraft = async () => {
    if (!publishTarget) return;
    try {
      setIsPublishing(true);
      await articleService.publishArticle(publishTarget._id);
      setActionSuccess(`Story "${publishTarget.title}" is now published online!`);
      setPublishTarget(null);
      fetchDrafts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish draft.';
      setError(msg);
    } finally {
      setIsPublishing(false);
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
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-[#353535]">
                Draft Management Archive
              </h1>
              <p className="text-sm text-[#353535]/80 font-sans">
                Review, revise, or dispatch your unreleased broadsheet drafts ({totalDrafts} total).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchDrafts()}
            disabled={loading}
            className="flex items-center gap-2 border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-4 py-2.5 rounded-none"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/author/articles/create">
            <Button variant="primary" className="flex items-center gap-2 border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-5 py-2.5 rounded-none">
              <Plus className="w-4 h-4" />
              New Story
            </Button>
          </Link>
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
            placeholder="Search draft title or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border border-[#353535] bg-[#F2EFE9] focus:bg-white rounded-none font-serif text-sm"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#353535]/60" />
        </div>
      </div>

      {/* Drafts Table / Grid */}
      <div className="overflow-hidden border border-[#353535] bg-[#F2EFE9]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#353535] font-serif uppercase tracking-widest text-sm">
            <Spinner size="lg" className="text-[#353535]" />
            <p className="mt-4 font-bold">Retrieving draft records...</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-[#353535] bg-[#E8E5DF] text-[#353535]">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-[#353535]">No drafts found</h3>
            <p className="mt-1 max-w-sm text-sm text-[#353535]/80 font-sans">
              {searchQuery
                ? 'No drafts match your search query. Try clearing filters.'
                : 'You have no saved drafts right now. Start writing your next great story!'}
            </p>
            {!searchQuery && (
              <Link to="/author/articles/create" className="mt-6">
                <Button variant="primary" className="flex items-center gap-2 border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-5 py-2.5 rounded-none">
                  <Plus className="h-4 w-4" />
                  Write New Story
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#353535] bg-[#E8E5DF] text-xs font-bold uppercase tracking-wider text-[#353535]">
                  <th className="py-4 px-6">Story Draft</th>
                  <th className="py-4 px-6">Categories</th>
                  <th className="py-4 px-6">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#353535]/20 text-sm">
                {drafts.map((draft) => {
                  const coverUrl = getMediaUrl(draft.coverImage);
                  const updatedDate = new Date(draft.updatedAt || draft.createdAt).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
                  );

                  return (
                    <tr
                      key={draft._id}
                      className="transition-colors hover:bg-white/60"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={coverUrl}
                            alt={draft.title}
                            className="h-14 w-20 flex-shrink-0 object-cover border border-[#353535] bg-[#E8E5DF]"
                          />
                          <div>
                            <Link
                              to={`/articles/${draft.slug}`}
                              className="font-serif font-bold text-[#353535] hover:text-[#D74108] line-clamp-1"
                            >
                              {draft.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-[#353535]/70 line-clamp-1 max-w-md font-sans">
                              {draft.excerpt || 'No excerpt provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {draft.categories && draft.categories.length > 0 ? (
                            draft.categories.slice(0, 2).map((cat, idx) => (
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
                          {updatedDate}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setPublishTarget(draft)}
                            className="flex items-center gap-1.5 border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-3 py-1.5 rounded-none"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            Publish
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/author/articles/edit/${draft._id}`)}
                            className="flex items-center gap-1.5 border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-3 py-1.5 rounded-none"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget(draft)}
                            className="p-1.5 border border-[#353535] bg-rose-600 text-white hover:bg-rose-700 rounded-none"
                            title="Delete Draft"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Draft Deletion"
      >
        <div className="space-y-4 font-sans text-[#353535]">
          <p className="text-sm">
            Are you sure you want to delete the draft story{' '}
            <span className="font-serif font-bold text-[#353535]">
              "{deleteTarget?.title}"
            </span>
            ? This action will move the draft to trash and cannot be undone.
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
              onClick={handleDeleteDraft}
              disabled={isDeleting}
              className="flex items-center gap-2 border border-[#353535] bg-rose-600 hover:bg-rose-700 text-white uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              {isDeleting && <Spinner size="sm" className="text-white" />}
              {isDeleting ? 'Deleting...' : 'Yes, Delete Draft'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={!!publishTarget}
        onClose={() => setPublishTarget(null)}
        title="Publish Article Online"
      >
        <div className="space-y-4 font-sans text-[#353535]">
          <p className="text-sm">
            You are about to publish{' '}
            <span className="font-serif font-bold text-[#353535]">
              "{publishTarget?.title}"
            </span>
            . Once published, it will be publicly circulated to all readers and indexed for search.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#353535]">
            <Button
              variant="outline"
              onClick={() => setPublishTarget(null)}
              disabled={isPublishing}
              className="border border-[#353535] bg-[#F2EFE9] text-[#353535] hover:bg-white uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              Keep as Draft
            </Button>
            <Button
              variant="primary"
              onClick={handlePublishDraft}
              disabled={isPublishing}
              className="flex items-center gap-2 border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-4 py-2 rounded-none"
            >
              {isPublishing && <Spinner size="sm" className="text-white" />}
              {isPublishing ? 'Publishing...' : 'Yes, Publish Online'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DraftsPage;
