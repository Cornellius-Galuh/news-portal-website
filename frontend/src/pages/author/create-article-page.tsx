import React from 'react';
import { Link } from 'react-router';
import ArticleEditor from '../../features/articles/components/article-editor';
import { ArrowLeft, PenTool } from 'lucide-react';

const CreateArticlePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Navigation & Header */}
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
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-[#353535]">
                Compose New Article
              </h1>
              <p className="text-sm text-[#353535]/80 font-sans">
                Draft, format, and dispatch stories to the InfoSalatiga broadsheet circulation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Main Container */}
      <ArticleEditor />
    </div>
  );
};

export default CreateArticlePage;
