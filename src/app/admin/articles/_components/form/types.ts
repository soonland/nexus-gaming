import type { ArticleStatus } from '@prisma/client';
import type { Article } from '@prisma/client';
import type { Dayjs } from 'dayjs';

export type GameWithDetails = {
  id: string;
  title: string;
  coverImage?: string | null;
  developer: { name: string };
  publisher: { name: string };
};

export type ArticleWithRelations = Article & {
  heroImage?: string | null;
  user: { username: string };
  category: { name: string } | null;
  games: GameWithDetails[];
};

export interface IArticleFormData {
  title: string;
  content: string;
  categoryId: string;
  gameIds: string[];
  status: ArticleStatus;
  publishedAt: string | null;
  updatedAt: string | null;
  heroImage: string | null;
  userId: string;
}

export interface IArticleHeroImageProps {
  heroImage: string | null;
  isUploading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IArticleMainContentProps {
  title: string;
  content: string;
  titleError: string;
  contentError: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export interface IArticleStatusSelectProps {
  status: ArticleStatus;
  onStatusChange: (value: ArticleStatus) => void;
}

export interface IArticleGamesSelectProps {
  gameIds: string[];
  onGamesChange: (value: string[]) => void;
  games?: GameWithDetails[];
}

type Category = {
  id: string;
  name: string;
};

type User = {
  id: string;
  username: string;
};

export interface IArticleMetadataPanelProps {
  categories?: Category[];
  users?: User[];
  games?: GameWithDetails[];
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryError: string;
  userId: string;
  publishedAt: Dayjs | null;
  canSelectArticleAuthor: boolean;
  updatedAt: Dayjs | null;
  status: ArticleStatus;
  gameIds: string[];
  heroImage: string | null;
  isUploading: boolean;
  onCategoryChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onPublishedAtChange: (value: Dayjs | null) => void;
  onUpdatedAtChange: (value: Dayjs | null) => void;
  onStatusChange: (value: ArticleStatus) => void;
  onGamesChange: (value: string[]) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
