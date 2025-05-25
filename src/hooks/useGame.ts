import type { Game, Platform, Company, Role } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import type { ICategoryData } from '@/types';

export interface IArticlePreview {
  id: string;
  title: string;
  heroImage?: string;
  publishedAt?: string;
  category: {
    name: string;
  };
  user: {
    username: string;
  };
  games: {
    id: string;
    title: string;
  }[];
}

export interface IRelatedArticle {
  id: string;
  title: string;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: ICategoryData;
  user: {
    id: string;
    username: string;
    role: Role;
  };
}

type GameWithRelations = Omit<Game, 'developerId' | 'publisherId'> & {
  platforms: Pick<
    Platform,
    | 'id'
    | 'name'
    | 'manufacturer'
    | 'color'
    | 'releaseDate'
    | 'createdAt'
    | 'updatedAt'
  >[];
  developer: Pick<
    Company,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'isDeveloper' | 'isPublisher'
  >;
  publisher: Pick<
    Company,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'isDeveloper' | 'isPublisher'
  >;
  articles: IRelatedArticle[];
};

export const GAME_QUERY_KEY = 'game';

async function fetchGame(id: string): Promise<GameWithRelations> {
  const response = await fetch(`/api/games/${id}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch game');
  }
  const data = await response.json();
  return data;
}

export function useGame(id: string) {
  return useQuery({
    queryKey: [GAME_QUERY_KEY, id],
    queryFn: () => fetchGame(id),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
