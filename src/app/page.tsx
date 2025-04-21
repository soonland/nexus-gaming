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
import { GameCard } from '@/components/games/GameCard';
import { useArticles } from '@/hooks/useArticles';
import { useGames } from '@/hooks/useGames';

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
  const { articles } = useArticles({ limit: 3 });
  const { games } = useGames({ limit: 3, admin: false });

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
            <Stack direction='row' justifyContent='center' spacing={2}>
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
            {articles.map(article => (
              <Grid key={article.id} size={4}>
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
            {games.map(game => (
              <Grid key={game.id} size={4}>
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
