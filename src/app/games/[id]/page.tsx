'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft as ArrowBack,
  FiUsers as Group,
  FiAlignJustify as Article,
} from 'react-icons/fi';

import { ArticleCard } from '@/components/articles/ArticleCard';
import { DateDisplay } from '@/components/common/DateDisplay';
import { Hero } from '@/components/common/Hero';
import { useGame } from '@/hooks/useGame';
import { formatters } from '@/lib/dayjs';

const GamePage = () => {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
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

  return (
    <Box>
      <Hero
        badges={[
          {
            id: crypto.randomUUID(),
            label: game.genre || 'Non catégorisé',
            color: 'primary',
          },
        ]}
        image={game.coverImage || '/images/placeholder-game.png'}
        metadata={
          <Stack alignItems='center' direction='row' spacing={3}>
            <Stack alignItems='center' direction='row' spacing={1}>
              <Group />
              <Typography variant='body2'>
                {game.developer.name} / {game.publisher.name}
              </Typography>
            </Stack>
            {game.releaseDate && (
              <DateDisplay date={new Date(game.releaseDate)} />
            )}
          </Stack>
        }
        title={game.title}
      />

      {/* Content Section */}
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Button
            startIcon={<ArrowBack />}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => router.back()}
          >
            Retour aux jeux
          </Button>

          {/* Game Content */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              border: 1,
              borderColor: theme.palette.divider,
              borderRadius: 1,
              p: 4,
            }}
          >
            <Stack spacing={3}>
              {/* Description */}
              {game.description && (
                <Typography
                  component='div'
                  sx={{ whiteSpace: 'pre-wrap' }}
                  variant='body1'
                >
                  {game.description}
                </Typography>
              )}

              {/* Platforms */}
              {game.platforms.length > 0 && (
                <Box>
                  <Typography gutterBottom variant='h6'>
                    Plateformes
                  </Typography>
                  <Stack direction='row' flexWrap='wrap' gap={1}>
                    {game.platforms.map(platform => (
                      <Chip
                        key={platform.id}
                        label={`${platform.name} (${platform.manufacturer})`}
                        size='medium'
                        variant='outlined'
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Articles Section */}
          {game.articles.length > 0 && (
            <Box>
              <Stack
                alignItems='center'
                direction='row'
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Article />
                <Typography variant='h5'>Articles liés</Typography>
              </Stack>
              <Box sx={{ width: '100%' }}>
                <Grid container spacing={3}>
                  {game.articles.map(article => {
                    const articleData = {
                      id: article.id,
                      title: article.title,
                      content: article.content || '',
                      category: {
                        id: article.category?.id || 'uncategorized',
                        name: article.category?.name || 'Non catégorisé',
                        createdAt: '', // dates vides car non utilisées dans l'affichage
                        updatedAt: '',
                      },
                      user: {
                        id: article.user.id,
                        username: article.user.username,
                        avatarUrl: undefined,
                        role: article.user.role,
                      },
                      status: 'PUBLISHED' as const,
                      publishedAt: article.publishedAt
                        ? formatters.custom(article.publishedAt, 'YYYY-MM-DD')
                        : undefined,
                      games: [],
                      createdAt: formatters.custom(
                        article.createdAt,
                        'YYYY-MM-DD'
                      ),
                      updatedAt: formatters.custom(
                        article.updatedAt,
                        'YYYY-MM-DD'
                      ),
                      heroImage: undefined,
                    };

                    return (
                      <Grid key={article.id} size={4}>
                        <ArticleCard article={articleData} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default GamePage;
