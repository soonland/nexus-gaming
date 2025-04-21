export type ArticleStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface ICategoryData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryForm {
  name: string;
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

export interface IGameData {
  id: string;
  title: string;
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
  releaseDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPlatformForm {
  name: string;
  manufacturer: string;
  releaseDate?: string | null;
}

export interface IArticleData {
  id: string;
  title: string;
  content: string;
  heroImage?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  category: ICategoryData;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  games: IGameData[];
  createdAt: string;
  updatedAt: string;
}

export type ArticleForm = {
  title: string;
  content: string;
  categoryId: string;
  gameIds?: string[];
  status?: ArticleStatus;
  publishedAt?: string | null;
  updatedAt?: string | null;
  heroImage?: string | null;
  userId?: string;
};

export type GameForm = {
  title: string;
  description?: string | null;
  releaseDate?: string | null;
  coverImage?: string | null;
  genre?: GameGenre | null;
  platformIds: string[];
  developerId: string;
  publisherId: string;
};
