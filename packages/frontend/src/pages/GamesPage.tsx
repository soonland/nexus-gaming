import { Box, useToast } from '@chakra-ui/react';
import { GameList } from '../components/games/GameList';
import { useGames } from '../hooks/useGames';
import { GameFormData } from '../types/game';

interface GamesPageProps {
  isAdmin?: boolean;
}

export const GamesPage = ({ isAdmin = false }: GamesPageProps) => {
  const toast = useToast();
  const { games, isLoading, createGame } = useGames();

  const handleGameCreate = async (data: GameFormData) => {
    try {
      await createGame(data);
      toast({
        title: 'Jeu créé',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de créer le jeu",
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <GameList
        games={games}
        isAdmin={isAdmin}
        isLoading={isLoading}
        onGameCreate={handleGameCreate}
      />
    </Box>
  );
};
