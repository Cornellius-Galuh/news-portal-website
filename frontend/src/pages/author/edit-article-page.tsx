import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { articleService, type Article } from '../../features/articles';
import ArticleEditor from '../../features/articles/components/article-editor';
import { ArrowLeft, Edit, AlertCircle } from 'lucide-react';
import Spinner from '../../components/ui/spinner';
import Button from '../../components/ui/button';

const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    articleService
      .getArticleById(id)
      .then((data) => {
        setArticle(data);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load article.';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-[#353535] font-serif uppercase tracking-widest text-sm">
        <Spinner size="lg" className="text-[#353535]" />
        <p className="mt-4 font-bold">Retrieving dispatch archive...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-serif">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border border-[#353535] bg-rose-100 text-rose-800">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#353535]">Cannot Edit Article Record</h2>
        <p className="mt-2 text-sm text-[#353535]/80 font-sans">
          {error || 'Article dispatch record not found.'}
        </p>
        <Link to="/author/articles/drafts" className="mt-6 inline-block font-sans">
          <Button variant="primary" className="border border-[#353535] bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] uppercase text-xs font-bold tracking-wider px-6 py-3 rounded-none">
            Back to Editorial Drafts
          </Button>
        </Link>
      </div>
    );
  }

  const categoryIds = article.categories?.map((cat) =>
    typeof cat === 'object' && cat !== null ? cat._id : cat,
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#353535] pb-6">
        <div>
          <Link
            to="/author/articles/drafts"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#353535] hover:text-[#D74108] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editorial Drafts
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 border border-[#353535] bg-[#353535] text-white">
              <Edit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-[#353535]">
                Revise Dispatch: "{article.title}"
              </h1>
              <p className="text-sm text-[#353535]/80 font-sans">
                Update draft headline, lead, copy, or media assets before public circulation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ArticleEditor
        initialData={{
          _id: article._id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          categories: categoryIds,
          coverImage: article.coverImage,
          images: article.images,
        }}
      />
    </div>
  );
};

export default EditArticlePage;
