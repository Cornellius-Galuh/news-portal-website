import React, { useEffect, useState } from 'react';
import { articleService, type Article } from '../../features/articles';
import ArticleCard from '../../features/articles/components/article-card';
import { Flame, RefreshCw } from 'lucide-react';
import Spinner from '../../components/ui/spinner';

const TrendingPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getTrendingArticles(15);
      setArticles(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load trending stories.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  const topThree = articles.slice(0, 3);
  const remaining = articles.slice(3);

  return (
    <div className="border border-[#353535] bg-[#E8E5DF] text-[#353535]">
      {/* Header Banner */}
      <div className="border-b border-[#353535] bg-[#F2EFE9] p-6 sm:p-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#D74108] text-[#D74108] rounded-none px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="h-3.5 w-3.5 fill-[#D74108]" />
            <span>InfoSalatiga Leaderboard</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#353535]">
            Trending Right Now
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#353535]/80 max-w-2xl font-sans">
            The most popular and engaging stories across our newspaper today, ranked live by reader views and community appreciation.
          </p>
        </div>

        <button
          onClick={fetchTrending}
          disabled={loading}
          className="border border-[#353535] bg-[#353535] text-white rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#D74108] hover:border-[#D74108] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Rank</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#F2EFE9]">
          <Spinner size="lg" />
          <p className="mt-4 font-serif text-lg font-bold uppercase tracking-wider">Loading Leaderboard...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-[#F2EFE9]">
          <p className="text-rose-600 font-bold mb-4">{error}</p>
          <button
            onClick={fetchTrending}
            className="border border-[#353535] bg-[#353535] text-white px-6 py-2 uppercase text-xs font-bold rounded-none hover:bg-[#D74108]"
          >
            Try Again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="p-16 text-center bg-[#F2EFE9]">
          <p className="font-serif text-xl font-bold uppercase text-[#353535]/60">No trending articles right now.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#353535]">
          {/* Top 3 Spotlight Section */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#353535]">
              {/* Rank #1 Lead Story (8 cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 bg-[#F2EFE9] relative">
                <div className="mb-4 inline-block border border-[#D74108] bg-[#D74108] text-white font-serif font-black text-sm uppercase px-3 py-1 rounded-none shadow-xs">
                  Rank #01 Lead Story
                </div>
                <ArticleCard article={topThree[0]} variant="featured" className="border-0 shadow-none bg-transparent p-0" />
              </div>

              {/* Ranks #2 & #3 (4 cols) */}
              <div className="lg:col-span-4 divide-y divide-[#353535] flex flex-col bg-[#E8E5DF]">
                {topThree[1] && (
                  <div className="p-6 flex-1 bg-[#F2EFE9]">
                    <div className="mb-3 inline-block border border-[#353535] text-[#353535] font-serif font-bold text-xs uppercase px-2.5 py-0.5">
                      Rank #02
                    </div>
                    <ArticleCard article={topThree[1]} variant="normal" className="border-0 shadow-none bg-transparent p-0" />
                  </div>
                )}
                {topThree[2] && (
                  <div className="p-6 flex-1 bg-[#F2EFE9]">
                    <div className="mb-3 inline-block border border-[#353535] text-[#353535] font-serif font-bold text-xs uppercase px-2.5 py-0.5">
                      Rank #03
                    </div>
                    <ArticleCard article={topThree[2]} variant="normal" className="border-0 shadow-none bg-transparent p-0" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Remaining Ranks #04 to #15 */}
          {remaining.length > 0 && (
            <div className="p-6 sm:p-10 bg-[#E8E5DF]">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-[#353535] mb-6 border-b border-[#353535] pb-3">
                More Top Ranked Stories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {remaining.map((art, idx) => {
                  const rankNum = String(idx + 4).padStart(2, '0');
                  return (
                    <div key={art._id} className="relative group border border-[#353535] bg-[#F2EFE9]">
                      <div className="absolute top-0 right-0 z-10 border-b border-l border-[#353535] bg-[#353535] text-white font-serif font-black text-xs px-2.5 py-1">
                        #{rankNum}
                      </div>
                      <ArticleCard article={art} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingPage;
