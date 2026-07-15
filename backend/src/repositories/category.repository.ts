import Category from '../models/category.model';
import { ICategoryDocument } from '../interfaces/category.interface';

export interface PaginatedCategoriesResult {
  data: (ICategoryDocument & { articleCount: number })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class CategoryRepository {
  async findPaginated(options: {
    page: number;
    limit: number;
    q?: string;
    sort?: string;
    order?: string;
  }): Promise<PaginatedCategoriesResult> {
    const { page = 1, limit = 10, q = '', sort = 'name', order = 'asc' } = options;

    const matchQuery: Record<string, unknown> = {};
    if (q && q.trim() !== '') {
      const regex = new RegExp(q.trim(), 'i');
      matchQuery.$or = [{ name: regex }, { description: regex }];
    }

    const total = await Category.countDocuments(matchQuery);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const sortField = sort || 'name';
    const sortOrder = order === 'desc' ? -1 : 1;

    const categories = await Category.aggregate([
      { $match: matchQuery },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'articles',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$categoryId', { $ifNull: ['$categories', []] }] },
                    { $eq: ['$status', 'PUBLISHED'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'articleStats',
        },
      },
      {
        $addFields: {
          articleCount: {
            $ifNull: [{ $arrayElemAt: ['$articleStats.count', 0] }, 0],
          },
        },
      },
      { $project: { articleStats: 0, __v: 0 } },
    ]);

    return {
      data: categories as (ICategoryDocument & { articleCount: number })[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findBySlug(slug: string): Promise<(ICategoryDocument & { articleCount: number }) | null> {
    const results = await Category.aggregate([
      { $match: { slug: slug.toLowerCase() } },
      {
        $lookup: {
          from: 'articles',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$categoryId', { $ifNull: ['$categories', []] }] },
                    { $eq: ['$status', 'PUBLISHED'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'articleStats',
        },
      },
      {
        $addFields: {
          articleCount: {
            $ifNull: [{ $arrayElemAt: ['$articleStats.count', 0] }, 0],
          },
        },
      },
      { $project: { articleStats: 0, __v: 0 } },
    ]);

    return (results[0] as ICategoryDocument & { articleCount: number }) || null;
  }

  async findByName(name: string): Promise<ICategoryDocument | null> {
    return Category.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
  }

  async findById(id: string): Promise<ICategoryDocument | null> {
    return Category.findById(id);
  }

  async create(data: Partial<ICategoryDocument>): Promise<ICategoryDocument> {
    return Category.create(data);
  }

  async updateById(id: string, data: Partial<ICategoryDocument>): Promise<ICategoryDocument | null> {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<ICategoryDocument | null> {
    return Category.findByIdAndDelete(id);
  }

  async countPublishedArticlesByCategoryId(categoryId: string): Promise<number> {
    const ArticleModel = Category.db.models.Article;
    if (ArticleModel) {
      return ArticleModel.countDocuments({
        categories: categoryId,
        status: 'PUBLISHED',
        isDeleted: { $ne: true },
      });
    }

    if (Category.db && Category.db.db) {
      const collection = Category.db.db.collection('articles');
      const objId = new Category.base.Types.ObjectId(categoryId);
      return collection.countDocuments({
        categories: objId,
        status: 'PUBLISHED',
        isDeleted: { $ne: true },
      });
    }

    return 0;
  }
}

export default new CategoryRepository();
