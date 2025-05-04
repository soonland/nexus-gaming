import type { Dayjs } from 'dayjs';

import type { GameGenre, ICompanyData, IPlatformData } from '@/types/api';

export interface IGameFormData {
  title: string;
  description: string | null;
  releaseDate: string | null;
  coverImage: string | null;
  platformIds: string[];
  developerId: string;
  publisherId: string;
  genre: GameGenre | null;
}

export interface IGameWithRelations {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  releaseDate?: string | null;
  coverImage?: string | null;
  genre?: GameGenre | null;
  developer?: ICompanyData | null;
  publisher?: ICompanyData | null;
  platforms?: Partial<IPlatformData>[];
}

export interface IGameMainContentProps {
  title: string;
  slug: string;
  description: string;
  titleError: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export interface IGameMetadataPanelProps {
  isOpen: boolean;
  developerId: string;
  publisherId: string;
  releaseDate: Dayjs | null;
  coverImage: string | null;
  genre: GameGenre | null;
  isUploading: boolean;
  developerError: string;
  publisherError: string;
  developers: ICompanyData[];
  publishers: ICompanyData[];
  platforms: IPlatformData[];
  platformIds: string[];
  onDeveloperChange: (id: string) => void;
  onPublisherChange: (id: string) => void;
  onReleaseDateChange: (date: Dayjs | null) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuickCompanyCreate: (role: 'developer' | 'publisher') => void;
  onPlatformsChange: (ids: string[]) => void;
  onGenreChange: (value: GameGenre | null) => void;
}

export interface IGameHeroImageProps {
  coverImage: string | null;
  isUploading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
