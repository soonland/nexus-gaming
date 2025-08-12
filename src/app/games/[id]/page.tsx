'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Skeleton,
  Stack,
} from '@mui/material';
import type { ArticleStatus } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import type { IBadge } from '@/components/common/Hero';
import { Hero } from '@/components/common/Hero';
import { GameContent } from '@/components/games/GameContent';
import { GameMeta } from '@/components/games/GameMeta';
import { RelatedArticles } from '@/components/games/RelatedArticles';
import { useGame } from '@/hooks/useGame';
import dayjs from '@/lib/dayjs';
import type {
  IArticleBasicData,
  ICategoryData,
  IGameBasicData,
} from '@/types/api';

const GamePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: game, isLoading, error } = useGame(id);

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>
          <AlertTitle>Erreur</AlertTitle>
          Impossible de charger le jeu
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton height={400} variant='rectangular' />
          <Skeleton height={40} variant='text' />
          <Stack spacing={2}>
            <Skeleton variant='text' />
            <Skeleton variant='text' />
            <Skeleton variant='text' />
          </Stack>
        </Stack>
      </Container>
    );
  }

  if (!game) return null;

  const formattedArticles: Partial<IArticleBasicData>[] = game.articles.map(
    article => {
      const category: ICategoryData | undefined = article.category
        ? {
            id: article.category.id,
            name: article.category.name,
            slug: article.category.slug,
            color: article.category.color,
            createdAt: dayjs(article.category.createdAt).format(),
            updatedAt: dayjs(article.category.updatedAt).format(),
          }
        : undefined;

      const games: IGameBasicData[] = [
        {
          id: game.id,
          title: game.title,
          slug: game.slug,
        },
      ];

      return {
        id: article.id,
        title: article.title,
        content: article.content || '',
        status: 'PUBLISHED' as ArticleStatus,
        publishedAt: article.publishedAt
          ? dayjs(article.publishedAt).format()
          : undefined,
        category,
        user: {
          id: article.user.id,
          username: article.user.username,
          role: article.user.role,
        },
        games,
        createdAt: dayjs(article.createdAt).format(),
        updatedAt: dayjs(article.updatedAt).format(),
      };
    }
  );

  // Create badges array with genre first, then platforms
  const badges: IBadge[] = [];

  // Add genre badge if exists
  if (game.genre) {
    badges.push({
      id: uuidv4(),
      label: game.genre,
      color: 'primary' as const,
    });
  }

  // Add platform badges
  if (game.platforms?.length) {
    badges.push(
      ...game.platforms.map(platform => ({
        id: uuidv4(),
        platform: {
          id: platform.id,
          name: platform.name,
          color: platform.color,
        },
      }))
    );
  }

  return (
    <Box>
      <Hero
        badges={badges}
        image={game.coverImage || undefined}
        metadata={
          <GameMeta
            developer={game.developer}
            publisher={game.publisher}
            releaseDate={game.releaseDate || undefined}
          />
        }
        title={game.title}
      />

      {/* Content Section */}
      <Container maxWidth='lg'>
        <Stack spacing={2}>
          <Button
            startIcon={<FiArrowLeft />}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => router.back()}
          >
            Retour aux jeux
          </Button>

          <GameContent description={game.description || undefined} />

          <RelatedArticles articles={formattedArticles} />
        </Stack>
      </Container>
    </Box>
  );
};

export default GamePage;
