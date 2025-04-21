'use client';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
  Container,
  Skeleton,
  Alert,
  Typography,
  Grid,
  Box,
} from '@mui/material';

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
        <Alert icon={<ReportProblemIcon />} severity='error' variant='outlined'>
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
              <Grid key={i} size={4}>
                <Skeleton
                  height={350}
                  sx={{ borderRadius: 1 }}
                  variant='rectangular'
                />
              </Grid>
            ))
          : games.map(game => (
              <Grid key={game.id} size={4}>
                <GameCard game={game} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default GamesPage;
