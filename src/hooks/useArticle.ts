import type { Article, User, Category, Game } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import type { IPlatformData } from '@/types';

type GameWithDetails = Pick<
  Game,
  'id' | 'title' | 'description' | 'coverImage' | 'releaseDate'
> & {
  platforms: IPlatformData[];
};

type ArticleWithRelations = Article & {
  heroImage?: string | null;
  user: Pick<User, 'username'>;
  category: Pick<Category, 'id' | 'name' | 'color'> | null;
  games: GameWithDetails[];
};

export const ARTICLE_QUERY_KEY = 'article';

async function fetchArticle(id: string): Promise<ArticleWithRelations> {
  const response = await fetch(`/api/articles/${id}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch article');
  }
  return response.json();
}

export function useArticle(id: string) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ARTICLE_QUERY_KEY, id],
    queryFn: () => fetchArticle(id),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    article,
    isLoading,
    error,
  };
}
