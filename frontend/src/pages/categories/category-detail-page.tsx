import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { Newspaper, ArrowLeft, FolderOpen, BookOpen } from 'lucide-react';
import { categoryService, type Category } from '../../features/categories';
import Spinner from '../../components/ui/spinner';

const CategoryDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryService.getCategory(slug);
      setCategory(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Category not found';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E3E1DE] text-[#353535] py-16 px-4 flex items-center justify-center">
        <div className="p-12 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] text-center">
          <Spinner size="lg" />
          <p className="mt-4 font-serif font-bold text-lg text-[#353535] uppercase tracking-wide">
            Retrieving Dossier Detail...
          </p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-[#E3E1DE] text-[#353535] py-16 px-4 flex items-center justify-center font-sans">
        <div className="p-12 bg-[#F9F8F6] border-2 border-[#D74108] rounded-2xl shadow-[6px_6px_0px_0px_rgba(215,65,8,1)] text-center max-w-md">
          <h2 className="font-serif font-black text-3xl uppercase text-[#353535] mb-2">Topic Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">{error || 'The requested category does not exist in our archives.'}</p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#D74108] text-white font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:bg-[#b83606] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Categories</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3E1DE] text-[#353535] py-10 px-4 font-sans selection:bg-[#D74108] selection:text-white">
      <header className="w-full max-w-5xl mx-auto mb-8">
        <div className="border-2 border-[#353535] bg-[#F9F8F6] p-6 sm:p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#353535] pb-3 mb-5 text-xs font-bold uppercase tracking-wider gap-2">
            <span className="flex items-center gap-1.5 text-[#D74108]">
              <Newspaper className="w-4 h-4" />
              <span>Paperio News Portal • Topic Dossier Archive</span>
            </span>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 hover:text-[#D74108] transition-colors font-mono text-[11px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO TOPIC DIRECTORY</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <FolderOpen className="w-8 h-8 text-[#D74108] mt-1 shrink-0" />
              <div>
                <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-[#353535]">
                  {category.name}
                </h1>
                <p className="text-sm sm:text-base font-medium text-gray-600 font-sans mt-2 max-w-2xl leading-relaxed">
                  {category.description || 'No editorial description provided for this topic archive.'}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#E3E1DE] border-2 border-[#353535] rounded-xl font-mono text-sm font-bold shadow-[3px_3px_0px_0px_rgba(53,53,53,1)]">
                <BookOpen className="w-4 h-4 text-[#D74108]" />
                <span>{category.articleCount ?? 0} {category.articleCount === 1 ? 'Article' : 'Articles'}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Archive Placeholder section */}
      <main className="w-full max-w-5xl mx-auto">
        <div className="p-12 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] text-center">
          <BookOpen className="w-12 h-12 text-[#D74108] mx-auto mb-3 stroke-[1.5]" />
          <h3 className="font-serif font-black text-2xl uppercase text-[#353535]">Article Repository Feed</h3>
          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto font-sans">
            Published articles assigned to the <span className="font-bold text-[#353535]">"{category.name}"</span> topic classification will automatically populate here as they pass editorial review.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CategoryDetailPage;
