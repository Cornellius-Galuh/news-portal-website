import { Link } from 'react-router';
import { FolderOpen, ArrowUpRight, BookOpen } from 'lucide-react';
import type { Category } from '../../types/category.types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex flex-col justify-between h-full p-6 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[5px_5px_0px_0px_rgba(53,53,53,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(53,53,53,1)] hover:border-[#D74108] transition-all duration-200"
    >
      <div>
        {/* Top Badge & Action Icon */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#353535]/15">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E3E1DE] border border-[#353535] rounded-full text-xs font-bold font-mono text-[#353535] uppercase tracking-wider group-hover:bg-[#D74108] group-hover:text-white transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{category.articleCount ?? 0} {category.articleCount === 1 ? 'Article' : 'Articles'}</span>
          </span>
          <span className="p-2 bg-white border-2 border-[#353535] rounded-lg text-[#353535] group-hover:bg-[#D74108] group-hover:text-white group-hover:border-[#353535] transition-colors shadow-[2px_2px_0px_0px_rgba(53,53,53,1)]">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Category Title */}
        <div className="flex items-start gap-2 mb-2">
          <FolderOpen className="w-5 h-5 text-[#D74108] mt-1 shrink-0" />
          <h3 className="font-serif font-black text-2xl uppercase tracking-tight text-[#353535] group-hover:text-[#D74108] transition-colors line-clamp-1">
            {category.name}
          </h3>
        </div>

        {/* Category Description */}
        <p className="text-sm text-gray-600 font-sans leading-relaxed line-clamp-3">
          {category.description || 'No editorial description provided for this topic category yet.'}
        </p>
      </div>

      {/* Footer Explore Link */}
      <div className="mt-6 pt-4 border-t-2 border-[#353535]/15 flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-[#353535] group-hover:text-[#D74108] transition-colors">
        <span>Explore Topic Dossier</span>
        <span className="font-mono text-[11px] text-gray-400">/{category.slug}</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
