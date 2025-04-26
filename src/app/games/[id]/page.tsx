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

import type { IBadge } from '@/components/common/Hero';
import { Hero } from '@/components/common/Hero';
import { GameContent } from '@/components/games/GameContent';
import { GameMeta } from '@/components/games/GameMeta';
import { RelatedArticles } from '@/components/games/RelatedArticles';
import { useGame } from '@/hooks/useGame';
import dayjs from '@/lib/dayjs';
import type { ArticleStatus } from '@/types/api';

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

  const formattedArticles = game.articles.map(article => ({
    ...article,
    publishedAt: article.publishedAt || undefined,
    content: article.content || '',
    createdAt: dayjs(article.createdAt).format('YYYY-MM-DD'),
    updatedAt: dayjs(article.updatedAt).format('YYYY-MM-DD'),
    games: [],
    status: 'PUBLISHED' as ArticleStatus,
  }));

  const badges: IBadge[] =
    (game.genre && [
      {
        id: crypto.randomUUID(),
        label: game.genre,
        color: 'primary',
      },
    ]) ??
    [];

  return (
    <Box>
      <Hero
        badges={badges}
        image={game.coverImage || '/images/placeholder-game.png'}
        metadata={
          <GameMeta
            developer={game.developer.name}
            publisher={game.publisher.name}
            releaseDate={game.releaseDate || undefined}
          />
        }
        title={game.title}
      />

      {/* Content Section */}
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Button
            startIcon={<FiArrowLeft />}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => router.back()}
          >
            Retour aux jeux
          </Button>

          <GameContent
            description={game.description || undefined}
            platforms={game.platforms}
            variant='contained'
          />

          <RelatedArticles articles={formattedArticles} />
        </Stack>
      </Container>
    </Box>
  );
};

export default GamePage;
