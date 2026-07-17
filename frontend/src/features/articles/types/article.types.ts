export const ArticleStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus];

export interface ArticleSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  images?: string[];
  author: string | { _id: string; username: string; avatar?: string; role?: string; bio?: string };
  categories: Array<string | { _id: string; name: string; slug: string }>;
  tags?: string[];
  seo?: ArticleSeo;
  viewCount: number;
  likeCount: number;
  commentCount?: number;
  status: ArticleStatus;
  publishedAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticlePayload {
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags?: string[];
}

export interface UpdateArticlePayload {
  title?: string;
  excerpt?: string;
  content?: string;
  categories?: string[];
  tags?: string[];
  images?: string[];
  coverImage?: string;
  status?: ArticleStatus;
}

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  author?: string;
  status?: ArticleStatus | string;
  category?: string;
  q?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PaginatedArticlesResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
