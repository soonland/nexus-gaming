import type { Article, User, Category, Game } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

type GameWithDetails = Pick<Game, 'id' | 'title' | 'coverImage'> & {
  developer: { name: string };
  publisher: { name: string };
};

type ArticleWithRelations = Omit<Article, 'userId' | 'categoryId'> & {
  user: Pick<User, 'username'>;
  category: Pick<Category, 'name'> | null;
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
  return useQuery({
    queryKey: [ARTICLE_QUERY_KEY, id],
    queryFn: () => fetchArticle(id),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
