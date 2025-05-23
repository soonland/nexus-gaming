'use client';

import {
  Container,
  Skeleton,
  Alert,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

import { GameCard } from '@/components/games/GameCard';
import { useGames } from '@/hooks/useGames';

const GamesPage = () => {
  const { games, isLoading, error } = useGames({
    limit: 100,
    admin: false,
  });

  if (error) {
    return (
      <Container maxWidth='lg'>
        <Alert icon={<FiAlertTriangle />} severity='error' variant='outlined'>
          Error loading games
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Box mb={4}>
        <Typography component='h1' variant='h4'>
          Games
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton
                  height={350}
                  sx={{ borderRadius: 1, mb: 4 }}
                  variant='rectangular'
                />
              </Grid>
            ))
          : games.map(game => (
              <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <GameCard game={game} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default GamesPage;
