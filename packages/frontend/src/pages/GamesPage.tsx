import { Box } from '@chakra-ui/react';
import { GameList } from '../components/games/GameList';
import { useGames } from '../hooks/useGames';

export const GamesPage = () => {
  const { games, isLoading } = useGames();

  return (
    <Box>
      <GameList
        games={games}
        isLoading={isLoading}
      />
    </Box>
  );
};
