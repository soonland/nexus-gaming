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
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import { ArticleContent } from '@/components/articles/ArticleContent';
import { ArticleMeta } from '@/components/articles/ArticleMeta';
import { RelatedGames } from '@/components/articles/RelatedGames';
import type { IBadge } from '@/components/common/Hero';
import { Hero } from '@/components/common/Hero';
import { useArticle } from '@/hooks/useArticle';
import dayjs from '@/lib/dayjs';
import type { IGameData } from '@/types';

const ArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { article, isLoading, error } = useArticle(id);

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>
          <AlertTitle>Erreur</AlertTitle>
          Impossible de charger l&apos;article
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

  if (!article) return null;

  const formattedGames: Array<Partial<IGameData>> = article.games.map(game => ({
    id: game.id,
    title: game.title,
    description: game.description || undefined,
    coverImage: game.coverImage || undefined,
    releaseDate: game.releaseDate
      ? dayjs(game.releaseDate).format('YYYY-MM-DD')
      : undefined,
    platforms: game.platforms,
  }));

  const badges: IBadge[] = [];
  // Add platform badges
  if (article.category) {
    badges.push({
      id: uuidv4(),
      platform: {
        id: article.category.id,
        name: article.category.name,
        color: article.category.color,
      },
    });
  }
  return (
    <Box>
      <Hero
        badges={badges}
        image={article.heroImage || article.games[0]?.coverImage || undefined}
        metadata={
          <ArticleMeta
            publishedAt={article.publishedAt || new Date()}
            username={article.user.username}
          />
        }
        title={article.title}
      />

      {/* Content Section */}
      <Container maxWidth='lg'>
        <Stack spacing={2}>
          <Button
            startIcon={<FiArrowLeft />}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => router.back()}
          >
            Retour aux articles
          </Button>

          <ArticleContent content={article.content} variant='contained' />

          <RelatedGames games={formattedGames} />
        </Stack>
      </Container>
    </Box>
  );
};

export default ArticlePage;
