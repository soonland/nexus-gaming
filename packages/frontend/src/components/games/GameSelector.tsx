import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Game } from '../../types/game';
import { useGames } from '../../hooks/useGames';
import { GameList } from './GameList';

interface GameSelectorProps {
  selectedGames: string[];
  onChange: (gameIds: string[]) => void;
}

export const GameSelector = ({ selectedGames, onChange }: GameSelectorProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { games } = useGames();
  const [tempSelectedGames, setTempSelectedGames] = useState<string[]>(selectedGames);

  useEffect(() => {
    setTempSelectedGames(selectedGames);
  }, [selectedGames]);

  const handleGameToggle = (gameId: string) => {
    setTempSelectedGames(current => 
      current.includes(gameId)
        ? current.filter(id => id !== gameId)
        : [...current, gameId]
    );
  };

  const handleSave = () => {
    onChange(tempSelectedGames);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedGames(selectedGames);
    onClose();
  };

  const removeGame = (gameId: string) => {
    onChange(selectedGames.filter(id => id !== gameId));
  };

  const selectedGameDetails = games?.filter(game => 
    selectedGames.includes(game.id)
  ) || [];

  return (
    <Box>
      <VStack align="stretch" spacing={3}>
        <Button size="sm" onClick={onOpen} colorScheme="blue" variant="outline">
          Sélectionner des jeux
        </Button>

        <Wrap spacing={2}>
          {selectedGameDetails.map(game => (
            <WrapItem key={game.id}>
              <Tag size="md" borderRadius="full" variant="subtle" colorScheme="blue">
                <TagLabel>{game.title}</TagLabel>
                <TagCloseButton onClick={() => removeGame(game.id)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner des jeux</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GameList
              games={games}
              selectionMode={true}
              selectedGames={tempSelectedGames}
              onGameSelect={handleGameToggle}
            />
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Text color="gray.500">
                {tempSelectedGames.length} jeu{tempSelectedGames.length > 1 ? 'x' : ''} sélectionné{tempSelectedGames.length > 1 ? 's' : ''}
              </Text>
              <Button variant="ghost" onClick={handleClose}>
                Annuler
              </Button>
              <Button colorScheme="blue" onClick={handleSave}>
                Confirmer la sélection
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
