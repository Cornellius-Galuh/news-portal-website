import mongoose from 'mongoose';
import Article from '../models/article.model';
import Category from '../models/category.model';
import { IArticleDocument } from '../interfaces/article.interface';
import { ArticleStatus } from '../types/enums';

export interface PaginatedArticlesResult {
  data: IArticleDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ArticleRepository {
  async findPaginated(options: {
    page: number;
    limit: number;
    sort?: string;
    order?: string;
    author?: string;
    status?: string;
    category?: string;
    q?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<PaginatedArticlesResult> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      author,
      status,
      category,
      q,
      fromDate,
      toDate,
    } = options;

    const query: Record<string, unknown> = {
      isDeleted: { $ne: true },
    };

    if (author && author.trim() !== '') {
      query.author = author.trim();
    }

    if (status && status.trim() !== '') {
      query.status = status.trim().toUpperCase();
    }

    if (category && category.trim() !== '') {
      const catVal = category.trim();
      if (mongoose.Types.ObjectId.isValid(catVal)) {
        query.categories = catVal;
      } else {
        const catDoc = await Category.findOne({ slug: catVal.toLowerCase() }).select('_id');
        if (catDoc) {
          query.categories = catDoc._id;
        } else {
          query.categories = new mongoose.Types.ObjectId();
        }
      }
    }

    if (fromDate || toDate) {
      const dateFilter: Record<string, Date> = {};
      if (fromDate && !isNaN(Date.parse(fromDate))) {
        dateFilter.$gte = new Date(fromDate);
      }
      if (toDate && !isNaN(Date.parse(toDate))) {
        dateFilter.$lte = new Date(toDate);
      }
      if (Object.keys(dateFilter).length > 0) {
        query.publishedAt = dateFilter;
      }
    }

    let sortOptions: Record<string, 1 | -1 | { $meta: string }> = {};
    if (q && q.trim() !== '') {
      try {
        query.$text = { $search: q.trim() };
        if (!sort || sort === 'createdAt') {
          sortOptions = { score: { $meta: 'textScore' } };
        } else {
          const sortOrder = order === 'asc' ? 1 : -1;
          sortOptions = { [sort]: sortOrder };
        }
      } catch {
        const regex = new RegExp(q.trim(), 'i');
        query.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
        const sortField = sort || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;
        sortOptions = { [sortField]: sortOrder };
      }
    } else {
      const sortField = sort || 'createdAt';
      const sortOrder = order === 'asc' ? 1 : -1;
      sortOptions = { [sortField]: sortOrder };
    }

    const total = await Article.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const articlesQuery = Article.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('author', 'username email avatar role')
      .populate('categories', 'name slug description');

    if (sortOptions.score) {
      articlesQuery.select({ score: { $meta: 'textScore' } });
    }

    const articles = await articlesQuery;

    return {
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findLatest(limit: number = 10): Promise<IArticleDocument[]> {
    return Article.find({
      status: ArticleStatus.PUBLISHED,
      isDeleted: { $ne: true },
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate('author', 'username email avatar role')
      .populate('categories', 'name slug description');
  }

  async findTrending(limit: number = 10): Promise<IArticleDocument[]> {
    const aggregated = await Article.aggregate([
      {
        $match: {
          status: ArticleStatus.PUBLISHED,
          isDeleted: { $ne: true },
        },
      },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: [{ $ifNull: ['$viewCount', 0] }, 1] },
              { $multiply: [{ $ifNull: ['$likeCount', 0] }, 5] },
              { $multiply: [{ $ifNull: ['$commentCount', 0] }, 10] },
            ],
          },
        },
      },
      { $sort: { trendingScore: -1, publishedAt: -1 } },
      { $limit: limit },
    ]);

    return Article.populate(aggregated, [
      { path: 'author', select: 'username email avatar role' },
      { path: 'categories', select: 'name slug description' },
    ]);
  }

  async findById(id: string): Promise<IArticleDocument | null> {
    return Article.findOne({ _id: id, isDeleted: { $ne: true } });
  }

  async findByIdPopulated(id: string): Promise<IArticleDocument | null> {
    return Article.findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('author', 'username email avatar role bio')
      .populate('categories', 'name slug description');
  }

  async findBySlug(slug: string): Promise<IArticleDocument | null> {
    return Article.findOne({ slug: slug.toLowerCase(), isDeleted: { $ne: true } })
      .populate('author', 'username email avatar role bio')
      .populate('categories', 'name slug description');
  }

  async findByExactSlugRaw(slug: string): Promise<IArticleDocument | null> {
    return Article.findOne({ slug: slug.toLowerCase() });
  }

  async create(data: Partial<IArticleDocument>): Promise<IArticleDocument> {
    const article = await Article.create(data);
    return article.populate([
      { path: 'author', select: 'username email avatar role' },
      { path: 'categories', select: 'name slug description' },
    ]);
  }

  async updateById(id: string, data: Partial<IArticleDocument>): Promise<IArticleDocument | null> {
    return Article.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'username email avatar role')
      .populate('categories', 'name slug description');
  }

  async softDeleteById(id: string): Promise<IArticleDocument | null> {
    return Article.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
  }
}

export default new ArticleRepository();
