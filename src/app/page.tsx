'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleCardSkeleton } from '@/components/articles/ArticleCardSkeleton';
import { GameCard } from '@/components/games/GameCard';
import { GameCardSkeleton } from '@/components/games/GameCardSkeleton';
import { useArticles } from '@/hooks/useArticles';
import { useGames } from '@/hooks/useGames';
import dayjs from '@/lib/dayjs';
import type { IArticleBasicData } from '@/types/api';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    component='h2'
    sx={{
      'mb': 4,
      'position': 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -1,
        left: 0,
        width: 60,
        height: 4,
        backgroundColor: 'primary.main',
        borderRadius: 2,
      },
    }}
    variant='h4'
  >
    {children}
  </Typography>
);

const ViewAllButton = ({ href }: { href: string }) => (
  <Button
    component={Link}
    endIcon={<FiArrowRight />}
    href={href}
    sx={{ mt: 4 }}
    variant='outlined'
  >
    Voir tout
  </Button>
);

const Home = () => {
  const { articles, isLoading: articlesLoading } = useArticles({ limit: 3 });
  const { games, isLoading: gamesLoading } = useGames({
    limit: 3,
    admin: false,
  });

  const skeletonArray = Array.from({ length: 3 }, (_, index) => index);

  const formattedArticles = articles.map(article => {
    // Format category dates if they exist
    const category = article.category
      ? {
          ...article.category,
          createdAt: dayjs(article.category.createdAt).format(),
          updatedAt: dayjs(article.category.updatedAt).format(),
        }
      : undefined;

    // Convert IArticleData to IArticleBasicData
    const basicArticle: IArticleBasicData = {
      id: article.id,
      title: article.title,
      content: article.content,
      heroImage: article.heroImage || undefined,
      status: article.status,
      publishedAt: article.publishedAt
        ? dayjs(article.publishedAt).format()
        : undefined,
      category,
      user: article.user,
      games: article.games.map(game => ({
        id: game.id,
        title: game.title,
      })),
      createdAt: dayjs(article.createdAt).format(),
      updatedAt: dayjs(article.updatedAt).format(),
    };

    return basicArticle;
  });

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          borderRadius: 0,
          py: 4,
          mb: 8,
        }}
      >
        <Container maxWidth='lg'>
          <Box maxWidth='800px' mx='auto' textAlign='center'>
            <Typography
              gutterBottom
              component='h1'
              sx={{
                fontWeight: 'bold',
                background:
                  'linear-gradient(45deg, primary.main, primary.light)',
                backgroundClip: 'text',
              }}
              variant='h2'
            >
              Nexus Gaming
            </Typography>
            <Typography color='text.secondary' sx={{ mb: 4 }} variant='h5'>
              Votre hub communautaire pour découvrir, discuter et partager
              autour du gaming
            </Typography>
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              justifyContent='center'
              spacing={2}
            >
              <Button
                component={Link}
                href='/games'
                size='large'
                variant='contained'
              >
                Découvrir les jeux
              </Button>
              <Button
                component={Link}
                href='/articles'
                size='large'
                variant='outlined'
              >
                Lire les articles
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Articles Section */}
      <Container maxWidth='lg'>
        <Box mb={8}>
          <SectionTitle>Articles Récents</SectionTitle>
          <Grid container spacing={4}>
            {articlesLoading
              ? skeletonArray.map(index => (
                  <Grid
                    key={`skeleton-${index}`}
                    size={{ xs: 12, sm: 6, md: 4 }}
                  >
                    <ArticleCardSkeleton />
                  </Grid>
                ))
              : formattedArticles.map(article => (
                  <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ArticleCard article={article} />
                  </Grid>
                ))}
          </Grid>
          <Box textAlign='center'>
            <ViewAllButton href='/articles' />
          </Box>
        </Box>

        {/* Games Section */}
        <Box>
          <SectionTitle>Jeux en Vedette</SectionTitle>
          <Grid container spacing={4}>
            {gamesLoading
              ? skeletonArray.map(index => (
                  <Grid
                    key={`skeleton-${index}`}
                    size={{ xs: 12, sm: 6, md: 4 }}
                  >
                    <GameCardSkeleton />
                  </Grid>
                ))
              : games.map(game => (
                  <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <GameCard game={game} />
                  </Grid>
                ))}
          </Grid>
          <Box textAlign='center'>
            <ViewAllButton href='/games' />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
