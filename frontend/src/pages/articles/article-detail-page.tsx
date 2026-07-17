import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { articleService, type Article } from '../../features/articles';
import { getMediaUrl } from '../../features/articles/components/article-card';
import useAuthStore from '../../store/auth.store';
import {
  ArrowLeft,
  Check,
  Eye,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Share2,
  Tag,
  X,
} from 'lucide-react';
import Button from '../../components/ui/button';
import Spinner from '../../components/ui/spinner';
import Modal from '../../components/ui/modal';

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    articleService
      .getArticleBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        setArticle(data);
        setLikeCount(data.likeCount || 0);
        articleService.recordView(data._id);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Article not found or unavailable.';
        setError(msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleToggleLike = async () => {
    if (!article) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLikeLoading(true);
      const res = await articleService.toggleLike(article._id);
      setLiked(res.liked);
      setLikeCount(res.likeCount);
    } catch {
      // ignore
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || 'Check out this article',
          text: article?.excerpt || '',
          url,
        });
        return;
      } catch {
        // Fallthrough
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(`Copy this URL to share: ${url}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 border border-[#353535] bg-[#F2EFE9] text-[#353535]">
        <Spinner size="lg" />
        <p className="mt-4 font-serif text-lg font-bold uppercase tracking-wider">Loading Article Record...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="border border-[#353535] bg-[#F2EFE9] px-4 py-20 text-center max-w-3xl mx-auto my-12">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <X className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold uppercase text-[#353535]">Article Not Found</h1>
        <p className="mt-2 text-sm text-[#353535]/70 max-w-md mx-auto font-sans">
          {error || 'The story you are looking for may have been archived, removed, or has an invalid URL.'}
        </p>
        <Link to="/" className="mt-6 inline-block border border-[#353535] bg-[#353535] text-white px-6 py-2.5 uppercase text-xs font-bold rounded-none hover:bg-[#D74108]">
          Return To Frontpage
        </Link>
      </div>
    );
  }

  const coverUrl = getMediaUrl(article.coverImage);
  const publishedDate = article.publishedAt || article.createdAt;
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const authorObj = typeof article.author === 'object' && article.author !== null ? article.author : null;
  const authorName = authorObj ? authorObj.username : typeof article.author === 'string' ? article.author : 'Editorial Staff';
  const authorRole = authorObj && authorObj.role ? authorObj.role : 'Journalist';
  const authorBio = authorObj && authorObj.bio ? authorObj.bio : 'Contributing writer and news analyst for InfoSalatiga.';

  return (
    <article className="border border-[#353535] bg-[#F2EFE9] text-[#353535]">
      {/* Top Navigation & Categories */}
      <div className="border-b border-[#353535] bg-[#E8E5DF] p-6 sm:p-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#353535] hover:text-[#D74108] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Newspaper
        </button>

        {/* Categories List */}
        <div className="mb-4 flex flex-wrap gap-2">
          {article.categories && article.categories.map((cat, idx) => {
            const catName = typeof cat === 'object' && cat !== null ? cat.name : cat;
            const catSlug = typeof cat === 'object' && cat !== null ? cat.slug : encodeURIComponent(cat);
            return (
              <Link
                key={idx}
                to={`/categories/${catSlug}`}
                className="border border-[#353535] bg-[#353535] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[#D74108] hover:border-[#D74108] transition-colors shadow-xs"
              >
                {catName}
              </Link>
            );
          })}
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#353535] leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-xl text-[#353535]/85 leading-relaxed font-sans max-w-4xl border-l-2 border-[#D74108] pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Meta & Actions Row */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-[#353535] pt-6 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-[#353535] font-black">{authorName}</span>
            <span className="text-[#D74108]">♦</span>
            <span>{authorRole}</span>
            <span className="text-[#D74108]">♦</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 border px-4 py-1.5 text-xs font-bold uppercase transition-all shadow-xs cursor-pointer ${
                liked
                  ? 'border-[#D74108] bg-[#D74108] text-white'
                  : 'border-[#353535] bg-white text-[#353535] hover:border-[#D74108] hover:text-[#D74108]'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-white' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <div className="flex items-center gap-1.5 border border-[#353535] bg-white/60 px-3.5 py-1.5 text-xs font-bold">
              <Eye className="h-3.5 w-3.5 text-[#353535]/70" />
              <span>{article.viewCount || 0}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 border border-[#353535] bg-white px-4 py-1.5 text-xs font-bold uppercase text-[#353535] hover:border-[#D74108] hover:text-[#D74108] transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="border-b border-[#353535] aspect-[16/9] w-full overflow-hidden bg-[#353535]/5">
        <img
          src={coverUrl}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-12 max-w-4xl mx-auto">
        <div
          className="prose prose-lg max-w-none font-sans text-[#353535] leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#353535] prose-a:text-[#D74108] prose-a:underline prose-img:border prose-img:border-[#353535] prose-blockquote:border-l-4 prose-blockquote:border-[#D74108] prose-blockquote:bg-[#E8E5DF]/50 prose-blockquote:py-2 prose-blockquote:px-4"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />

        {/* Gallery Section */}
        {article.images && article.images.length > 0 && (
          <div className="mt-12 border-t border-[#353535] pt-8">
            <h3 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold uppercase text-[#353535]">
              <ImageIcon className="h-5 w-5 text-[#D74108]" />
              Media Documentation ({article.images.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {article.images.map((imgPath, idx) => {
                const imgUrl = getMediaUrl(imgPath);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="group aspect-video cursor-pointer overflow-hidden border border-[#353535] bg-[#353535]/5 shadow-xs transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery preview ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 pt-6 border-t border-[#353535]/30">
            <Tag className="h-4 w-4 text-[#D74108] mr-1" />
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="border border-[#353535] bg-[#E8E5DF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#353535]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Credentials Card */}
        <div className="mt-12 border border-[#353535] bg-[#E8E5DF] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center border border-[#353535] bg-[#353535] text-2xl font-serif font-black text-white">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D74108]">
                Reported By
              </span>
              <h3 className="mt-1 font-serif text-2xl font-bold text-[#353535]">
                {authorName}
              </h3>
              <p className="mt-2 text-sm text-[#353535]/80 leading-relaxed font-sans">
                {authorBio}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Section Placeholder (Sprint 4) */}
        <div className="mt-12 border border-dashed border-[#353535] bg-[#E8E5DF]/60 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-[#353535] bg-white text-[#D74108]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold uppercase text-[#353535]">
            Letters to the Editor & Comments
          </h3>
          <p className="mt-1 max-w-md mx-auto text-sm text-[#353535]/75 font-sans">
            Interactive reader discussions and feedback columns are scheduled for release in{' '}
            <span className="font-bold text-[#D74108]">Sprint 4</span>.
          </p>
        </div>
      </div>

      {/* Gallery Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Documentation Preview"
      >
        <div className="flex flex-col items-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged gallery preview"
              className="max-h-[75vh] w-auto border border-[#353535] object-contain shadow-lg"
            />
          )}
          <Button
            variant="outline"
            onClick={() => setSelectedImage(null)}
            className="mt-4 border-[#353535] uppercase font-bold text-xs rounded-none"
          >
            Close Preview
          </Button>
        </div>
      </Modal>
    </article>
  );
};

export default ArticleDetailPage;
