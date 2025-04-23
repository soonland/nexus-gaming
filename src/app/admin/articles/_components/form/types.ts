import type { ArticleStatus, Role } from '@prisma/client';
import type { Dayjs } from 'dayjs';

import type {
  IGameData,
  ICategoryData,
  IApprovalHistoryData,
  IArticleData,
} from '@/types/api';

export interface IArticleWithRelations
  extends Omit<IArticleData, 'category' | 'games' | 'user'> {
  categoryId: string;
  category: ICategoryData;
  games: IGameData[];
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    role: Role;
  };
}

export interface IArticleMetadataPanelProps {
  approvalHistory?: IApprovalHistoryData[];
  canSelectArticleAuthor: boolean;
  categories: ICategoryData[];
  categoryError?: string;
  categoryId: string;
  gameIds: string[];
  games: IGameData[];
  heroImage: string | null;
  isOpen: boolean;
  isLoading?: boolean;
  isUploading: boolean;
  publishedAt: Dayjs | null;
  status: ArticleStatus;
  updatedAt: Dayjs | null;
  userId: string;
  userRole?: Role;
  users?: Array<{
    id: string;
    username: string;
  }>;
  onCategoryChange: (value: string) => void;
  onClose: () => void;
  onGamesChange: (gameIds: string[]) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPublishedAtChange: (date: Dayjs | null) => void;
  onStatusChange: (status: ArticleStatus, comment?: string) => Promise<void>;
  onUpdatedAtChange: (date: Dayjs | null) => void;
  onUserChange: (value: string) => void;
}

export interface IArticleStatusSelectProps {
  article: IArticleData;
  userRole?: Role;
  onStatusChange: (status: ArticleStatus, comment?: string) => Promise<void>;
}

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

export interface IArticleGamesSelectProps {
  games: IGameData[];
  gameIds: string[];
  onGamesChange: (gameIds: string[]) => void;
}

export interface IArticleMainContentProps {
  title: string;
  content: string;
  titleError?: string;
  contentError?: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}
