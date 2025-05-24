import type { Role, ApprovalAction } from '@prisma/client';

export type ArticleStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'NEEDS_CHANGES'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'DELETED';

export interface ICategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryForm {
  name: string;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
  parentId?: string | null;
}

export type GameGenre =
  | 'RPG'
  | 'ACTION'
  | 'ADVENTURE'
  | 'SPORTS'
  | 'RACING'
  | 'STRATEGY'
  | 'SHOOTER'
  | 'PUZZLE'
  | 'SIMULATION'
  | 'FIGHTING';

export interface IGameBasicData {
  id: string;
  title: string;
  slug: string;
}

export interface IGameData extends IGameBasicData {
  description?: string;
  coverImage?: string;
  releaseDate?: string;
  genre?: GameGenre;
  developer: ICompanyData;
  publisher: ICompanyData;
  platforms: IPlatformData[];
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyData {
  id: string;
  name: string;
  isDeveloper: boolean;
  isPublisher: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformData {
  id: string;
  name: string;
  manufacturer: string;
  color?: string | null;
  releaseDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformForm {
  name: string;
  manufacturer: string;
  color?: string | null;
  releaseDate?: string | null;
}

// Base interface for minimal article data
export interface IArticleBasicData {
  id: string;
  title: string;
  content: string;
  heroImage?: string | null;
  status: ArticleStatus;
  publishedAt?: string;
  category?: ICategoryData;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    role: Role;
  };
  games: IGameBasicData[];
  createdAt: string;
  updatedAt: string;
}

// Full article interface with all fields
export interface IArticleData extends IArticleBasicData {
  previousStatus?: ArticleStatus;
  deletedAt?: string;
  category: ICategoryData;
  currentReviewer?: {
    id: string;
    username: string;
    avatarUrl?: string;
    role: Role;
  };
  approvalHistory?: IApprovalHistoryData[];
  games: IGameData[];
}

export interface IApprovalHistoryData {
  id: string;
  fromStatus: ArticleStatus;
  toStatus: ArticleStatus;
  action: ApprovalAction;
  comment?: string;
  actionBy: {
    id: string;
    username: string;
    role: Role;
  };
  createdAt: string;
}

export interface IArticleForm {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  gameIds?: string[];
  status?: ArticleStatus;
  publishedAt?: string | null;
  updatedAt?: string | null;
  heroImage?: string | null;
  userId?: string;
}

export type ArticleStatusUpdate = {
  status: ArticleStatus;
  previousStatus?: ArticleStatus;
  comment?: string;
  reviewerId?: string;
} & (
  | {
      status: 'DELETED';
      previousStatus: ArticleStatus;
    }
  | {
      status: Exclude<ArticleStatus, 'DELETED'>;
      previousStatus?: ArticleStatus;
    }
);

export interface IGameForm {
  title: string;
  description?: string | null;
  releaseDate?: string | null;
  coverImage?: string | null;
  genre?: GameGenre | null;
  platformIds: string[];
  developerId: string;
  publisherId: string;
}
