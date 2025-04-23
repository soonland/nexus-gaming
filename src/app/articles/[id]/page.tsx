'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { FaGamepad } from 'react-icons/fa';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

import { DateDisplay } from '@/components/common/DateDisplay';
import { Hero } from '@/components/common/Hero';
import { GameCard } from '@/components/games/GameCard';
import { useArticle } from '@/hooks/useArticle';
import dayjs from '@/lib/dayjs';

const ArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
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

  return (
    <Box>
      <Hero
        badges={
          article.category
            ? [
                {
                  id: crypto.randomUUID(),
                  label: article.category.name,
                  color: 'primary',
                },
              ]
            : []
        }
        image={article.heroImage || article.games[0]?.coverImage || undefined}
        metadata={
          <Stack alignItems='center' direction='row' spacing={3}>
            <Stack alignItems='center' direction='row' spacing={1}>
              <FiUser />
              <Typography variant='body2'>{article.user.username}</Typography>
            </Stack>
            <DateDisplay
              date={
                article.publishedAt ? new Date(article.publishedAt) : new Date()
              }
            />
          </Stack>
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

          {/* Article Content */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              border: 1,
              borderColor: theme.palette.divider,
              borderRadius: 1,
              p: 4,
            }}
          >
            <Typography
              component='div'
              sx={{ whiteSpace: 'pre-wrap' }}
              variant='body1'
            >
              {article.content}
            </Typography>
          </Box>

          {/* Games Section */}
          {article.games.length > 0 && (
            <Box>
              <Stack
                alignItems='center'
                direction='row'
                spacing={1}
                sx={{ mb: 2 }}
              >
                <FaGamepad />
                <Typography variant='h5'>Jeux mentionnés</Typography>
              </Stack>
              <Grid container spacing={3}>
                {article.games.map(game => {
                  return (
                    <Grid key={game.id} size={4}>
                      <GameCard
                        game={{
                          id: game.id,
                          title: game.title,
                          description: game.description || undefined,
                          coverImage: game.coverImage || undefined,
                          releaseDate: game.releaseDate
                            ? dayjs(game.releaseDate).format('YYYY-MM-DD')
                            : undefined,
                          platforms: game.platforms,
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ArticlePage;
