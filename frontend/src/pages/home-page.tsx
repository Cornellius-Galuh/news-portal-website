import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { articleService, ArticleStatus, type Article } from '../features/articles';
import ArticleCard from '../features/articles/components/article-card';
import Spinner from '../components/ui/spinner';

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      articleService.getTrendingArticles(10).catch(() => []),
      articleService
        .getArticles({ status: ArticleStatus.PUBLISHED, limit: 10, sort: 'publishedAt', order: 'desc' })
        .then((res) => res.data)
        .catch(() => []),
    ]).then(([trendingRes, latestRes]) => {
      if (!isMounted) return;
      setTrending(trendingRes || []);
      setLatest(latestRes || []);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#E8E5DF] text-[#353535] min-h-[85vh]">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 border border-[#353535] bg-[#F2EFE9] text-[#353535]">
          <Spinner size="lg" />
          <p className="mt-4 font-serif text-lg font-bold uppercase tracking-wider">
            Loading InfoSalatiga Newsroom...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-b border-l border-[#353535]">
          {/* Main Left Columns (8 cols out of 12) */}
          <div className="lg:col-span-8 border-r border-[#353535] flex flex-col">
            {/* Top Row: Two Articles Side by Side (Like Record-Breaking Sale + Catastrophic Volcanic Eruption) */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#353535]">
              {/* Left Column in Top Row (4 cols) */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#353535]">
                {trending[1] ? (
                  <ArticleCard article={trending[1]} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                ) : latest[0] ? (
                  <ArticleCard article={latest[0]} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                ) : null}
              </div>

              {/* Right Column in Top Row: Giant Featured Lead Story (7 cols) */}
              <div className="md:col-span-7 bg-[#F2EFE9]">
                {trending[0] ? (
                  <ArticleCard article={trending[0]} variant="featured" className="border-0 shadow-none bg-transparent h-full" />
                ) : latest[1] ? (
                  <ArticleCard article={latest[1]} variant="featured" className="border-0 shadow-none bg-transparent h-full" />
                ) : null}
              </div>
            </div>

            {/* Bottom Row: Two Articles Side by Side (Like Conservationist Discovered + Archaeologists Discover Tomb) */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#353535]">
                {trending[2] ? (
                  <ArticleCard article={trending[2]} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                ) : latest[2] ? (
                  <ArticleCard article={latest[2]} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                ) : null}
              </div>

              <div className="md:col-span-7">
                {trending[3] ? (
                  <ArticleCard article={trending[3]} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                ) : latest[3] ? (
                  <ArticleCard article={latest[3]} variant="normal" className="border-0 shadow-none bg-transparent h-full" />
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column Sidebar (4 cols out of 12 - Popular Article Now & Relatable News) */}
          <div className="lg:col-span-4 border-r border-[#353535] bg-[#F2EFE9] flex flex-col">
            {/* Sidebar Top Header Box */}
            <div className="border-b border-[#353535] p-5 flex items-center justify-between bg-[#E8E5DF]">
              <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#353535]">
                Popular Article Now
              </h2>
              <span className="border border-[#D74108] text-[#D74108] rounded-full px-2.5 py-0.5 text-xs font-bold uppercase">
                {trending.length || 15} New
              </span>
            </div>

            {/* Ranked List: 01, 02, 03, 04, 05 exactly like Paperio Reference */}
            <div className="divide-y divide-[#353535]">
              {(trending.length > 0 ? trending.slice(0, 6) : latest.slice(0, 6)).map((art, index) => {
                const rankNumber = String(index + 1).padStart(2, '0');
                const authorName =
                  typeof art.author === 'object' && art.author !== null ? art.author.username : art.author || 'Editorial';
                const formattedDate = new Date(art.publishedAt || art.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <Link
                    key={art._id}
                    to={`/articles/${art.slug}`}
                    className="group block p-5 hover:bg-white/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-serif font-black text-3xl sm:text-4xl text-[#353535] italic leading-none shrink-0 group-hover:text-[#D74108] transition-colors">
                        {rankNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#353535] group-hover:text-[#D74108] transition-colors line-clamp-2 leading-snug mb-1.5">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#353535]/70 font-medium">
                          — {formattedDate}, {authorName}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Vintage Sidebar Promotion Box / Relatable News Grid */}
            <div className="border-t border-[#353535] p-6 bg-[#E8E5DF] mt-auto">
              <div className="border border-[#353535] p-5 bg-[#F2EFE9] text-center shadow-xs">
                <span className="text-[#D74108] font-serif font-black text-xs uppercase tracking-widest block mb-1">
                  InfoSalatiga Exclusive
                </span>
                <h4 className="font-serif text-xl font-bold uppercase tracking-tight text-[#353535] mb-2">
                  Open For Journalists Now!
                </h4>
                <ul className="text-left text-xs space-y-1.5 text-[#353535]/80 mb-4 px-2">
                  <li>1. For citizens aged 18 years and above</li>
                  <li>2. Have a passion for truth & local reporting</li>
                  <li>3. High standard of investigative journalism</li>
                  <li>4. Access directly from our Author Studio</li>
                </ul>
                <Link
                  to="/become-author"
                  className="inline-block border border-[#353535] bg-[#353535] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-none hover:bg-[#D74108] hover:border-[#D74108] transition-colors"
                >
                  Apply As Author →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
