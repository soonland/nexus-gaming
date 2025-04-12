'use client';

import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  HStack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useCallback, useMemo, useEffect } from 'react';

import { useGames } from '@/hooks/useGames';

import GameSelectorList from './GameSelectorList';

interface GameSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

export default function GameSelector({
  selectedIds,
  onChange,
  error,
}: GameSelectorProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useGames({ limit: '100' }); // Get all games for selector
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedIds);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset temp selection when modal opens
  useEffect(() => {
    setTempSelectedIds(selectedIds);
  }, [selectedIds, isOpen]);

  const handleGameToggle = useCallback((gameId: string) => {
    setTempSelectedIds(current =>
      current.includes(gameId)
        ? current.filter(id => id !== gameId)
        : [...current, gameId]
    );
  }, []);

  const handleSave = () => {
    onChange(tempSelectedIds);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedIds(selectedIds);
    onClose();
  };

  const removeGame = (gameId: string) => {
    onChange(selectedIds.filter(id => id !== gameId));
  };

  const selectedGames = useMemo(
    () => (data?.games || []).filter(game => selectedIds.includes(game.id)),
    [data?.games, selectedIds]
  );

  const filteredGames = useMemo(() => {
    const games = data?.games || [];
    if (!searchTerm) return games;
    const term = searchTerm.toLowerCase();
    return games.filter(
      game =>
        game.title.toLowerCase().includes(term) ||
        game.platforms.some(p => p.name.toLowerCase().includes(term))
    );
  }, [data?.games, searchTerm]);

  return (
    <FormControl isInvalid={!!error}>
      <VStack align='stretch' spacing={3}>
        <Button
          colorScheme='blue'
          leftIcon={<AddIcon />}
          size='sm'
          variant='outline'
          onClick={onOpen}
        >
          Sélectionner des jeux
        </Button>

        <Wrap spacing={2}>
          {selectedGames.map(game => (
            <WrapItem key={game.id}>
              <Tag
                borderRadius='full'
                colorScheme='blue'
                size='md'
                variant='subtle'
              >
                <TagLabel>{game.title}</TagLabel>
                <TagCloseButton onClick={() => removeGame(game.id)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      <Modal isOpen={isOpen} size='xl' onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner des jeux</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GameSelectorList
              games={filteredGames}
              searchTerm={searchTerm}
              selectedGames={tempSelectedIds}
              onGameSelect={handleGameToggle}
              onSearchChange={setSearchTerm}
            />
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Text color='gray.500'>
                {tempSelectedIds.length} jeu
                {tempSelectedIds.length > 1 ? 'x' : ''} sélectionné
                {tempSelectedIds.length > 1 ? 's' : ''}
              </Text>
              <Button variant='ghost' onClick={handleClose}>
                Annuler
              </Button>
              <Button colorScheme='blue' onClick={handleSave}>
                Confirmer la sélection
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
