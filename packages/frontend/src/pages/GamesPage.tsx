import {
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { useState } from 'react';
import { GameList } from '../components/games/GameList';
import { GameDetail } from '../components/games/GameDetail';
import { useGames, useGameDetails } from '../hooks/useGames';
import { Game, GameFormData } from '../types/game';

interface GamesPageProps {
  isAdmin?: boolean;
}

export const GamesPage = ({ isAdmin = false }: GamesPageProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const {
    games,
    isLoading,
    createGame,
    updateGame,
  } = useGames();

  const { game: selectedGame, isLoading: isLoadingDetails } = useGameDetails(
    selectedGameId || ''
  );

  const handleGameClick = (game: Game) => {
    setSelectedGameId(game.id);
    onOpen();
  };

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

  const handleGameUpdate = async (data: GameFormData) => {
    if (!selectedGameId) return;

    try {
      await updateGame({ id: selectedGameId, data });
      toast({
        title: 'Jeu mis à jour',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le jeu",
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
        onGameClick={handleGameClick}
        onGameCreate={handleGameCreate}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0}>
            {selectedGame && !isLoadingDetails && (
              <GameDetail
                game={selectedGame}
                isAdmin={isAdmin}
                onUpdate={handleGameUpdate}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
