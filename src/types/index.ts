import type {
  Game,
  User,
  Role,
  Category,
  Article,
  ArticleStatus,
} from '@prisma/client';

export type {
  GameForm,
  IGameData as GameData,
  IPlatformForm,
  IPlatformData,
  ICategoryData,
  ICategoryForm,
} from './api';

export interface IArticleFormData {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  gameIds: string[];
  status?: ArticleStatus;
  publishedAt?: string | null;
  updatedAt?: string | null;
  heroImage?: string | null;
  userId?: string;
  currentReviewerId?: string | null;
}

// ArticleForm now includes all fields from IArticleFormData
export type ArticleForm = IArticleFormData;

export interface IArticleData extends Article {
  category: Category;
  user: {
    id: string;
    username: string;
    role: Role;
  };
  games: Game[];
}

export interface IArticleWithAuthor extends Article {
  user: {
    id: string;
    username: string;
    role: Role;
  };
  category?: {
    id: string;
    name: string;
    color?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  games?: {
    id: string;
    title: string;
    coverImage: string | null;
    genre: string;
  }[];
}

export interface IArticleStatusUpdate {
  status: ArticleStatus;
  comment?: string;
  previousStatus?: ArticleStatus;
  reviewerId?: string;
}

export interface INotificationData {
  id: string;
  title: string;
  content: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  createdAt: Date;
  isRead: boolean;
}

export interface IUser extends User {
  avatarUrl: string | null;
}
