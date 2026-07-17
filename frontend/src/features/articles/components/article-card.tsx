import React from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Eye, Heart, Share2 } from 'lucide-react';
import type { Article } from '../types/article.types';

export interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'normal' | 'compact';
  className?: string;
}

export const getMediaUrl = (path?: string): string => {
  if (!path) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'normal',
  className = '',
}) => {
  const coverUrl = getMediaUrl(article.coverImage);
  const publishedDate = article.publishedAt || article.createdAt;
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const authorName = typeof article.author === 'object' && article.author !== null
    ? article.author.username
    : typeof article.author === 'string'
    ? article.author
    : 'Editorial Team';

  const catName = article.categories && article.categories.length > 0
    ? (typeof article.categories[0] === 'object' && article.categories[0] !== null
        ? article.categories[0].name
        : article.categories[0])
    : 'General';

  if (variant === 'featured') {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={`group block border border-[#353535] bg-[#F2EFE9] p-6 sm:p-8 hover:bg-[#E8E5DF] transition-all duration-300 shadow-xs hover:shadow-md ${className}`}
      >
        {/* Title and Top Masthead Meta */}
        <div className="mb-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#353535] group-hover:text-[#D74108] transition-colors leading-tight mb-3">
            {article.title}
          </h2>

          <div className="flex items-center justify-between border-b border-[#353535] pb-3 text-xs font-semibold uppercase tracking-wider text-[#353535]/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#353535]">{catName}</span>
              <span className="text-[#D74108]">♦</span>
              <span>{authorName}</span>
              <span className="text-[#D74108]">♦</span>
              <span>{formattedDate}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#353535] group-hover:text-[#D74108] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Hero Image Box with vintage border */}
        <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden border border-[#353535] bg-[#353535]/5 mb-5 relative">
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Excerpt and Engagement Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {article.excerpt && (
            <p className="line-clamp-3 max-w-3xl text-sm sm:text-base text-[#353535]/90 leading-relaxed font-sans">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs font-semibold text-[#353535]/70 shrink-0 border-t sm:border-t-0 border-[#353535]/30 pt-3 sm:pt-0">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.viewCount || 0}
            </span>
            <span className="flex items-center gap-1 text-[#D74108]">
              <Heart className="w-3.5 h-3.5 fill-[#D74108]" />
              {article.likeCount || 0}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={`group flex items-start gap-4 border-b border-[#353535] py-4 transition-colors hover:bg-white/30 px-2 ${className}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#353535]/70 mb-1">
            <span className="text-[#353535]">{catName}</span>
            <span className="text-[#D74108]">♦</span>
            <span>{formattedDate}</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#353535] group-hover:text-[#D74108] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </div>

        <div className="h-16 w-20 sm:h-20 sm:w-24 shrink-0 overflow-hidden border border-[#353535] bg-[#353535]/5">
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    );
  }

  // Normal Variant (Vintage Newspaper Grid Card)
  return (
    <Link
      to={`/articles/${article.slug}`}
      className={`group flex flex-col border border-[#353535] bg-[#F2EFE9] p-5 hover:bg-white/40 transition-all duration-300 shadow-xs hover:shadow-md ${className}`}
    >
      {/* Title & Meta */}
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#353535] group-hover:text-[#D74108] transition-colors leading-tight mb-2.5 line-clamp-2">
        {article.title}
      </h3>

      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#353535]/75 border-b border-[#353535] pb-2.5 mb-3.5">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[#353535] font-bold">{catName}</span>
          <span className="text-[#D74108]">♦</span>
          <span className="truncate">{authorName}</span>
          <span className="text-[#D74108] hidden sm:inline">♦</span>
          <span className="hidden sm:inline">{formattedDate}</span>
        </div>
        <Share2 className="w-3.5 h-3.5 text-[#353535] shrink-0 group-hover:text-[#D74108]" />
      </div>

      {/* Image Box */}
      <div className="aspect-[16/10] w-full overflow-hidden border border-[#353535] bg-[#353535]/5 mb-3.5">
        <img
          src={coverUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="line-clamp-3 text-sm text-[#353535]/85 leading-relaxed font-sans mb-4 flex-1">
          {article.excerpt}
        </p>
      )}

      {/* Bottom status line */}
      <div className="mt-auto pt-3 border-t border-[#353535]/30 flex items-center justify-between text-xs font-semibold text-[#353535]/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {article.viewCount || 0}
          </span>
          <span className="flex items-center gap-1 text-[#D74108]">
            <Heart className="w-3.5 h-3.5 fill-[#D74108]" />
            {article.likeCount || 0}
          </span>
        </div>
        <span className="text-[#D74108] uppercase tracking-wider font-bold group-hover:underline flex items-center gap-1">
          Read More <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
};

export default ArticleCard;
