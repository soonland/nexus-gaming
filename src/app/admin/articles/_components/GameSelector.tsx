'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  Box,
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
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useGames } from '@/hooks/useGames'
import GameSelectorList from './GameSelectorList'

interface GameSelectorProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}

export default function GameSelector({
  selectedIds,
  onChange,
  error,
}: GameSelectorProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { games = [] } = useGames()
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedIds)
  const [searchTerm, setSearchTerm] = useState('')

  // Reset temp selection when modal opens
  React.useEffect(() => {
    setTempSelectedIds(selectedIds)
  }, [selectedIds, isOpen])

  const handleGameToggle = useCallback((gameId: string) => {
    setTempSelectedIds(current =>
      current.includes(gameId)
        ? current.filter(id => id !== gameId)
        : [...current, gameId]
    )
  }, [])

  const handleSave = () => {
    onChange(tempSelectedIds)
    onClose()
  }

  const handleClose = () => {
    setTempSelectedIds(selectedIds)
    onClose()
  }

  const removeGame = (gameId: string) => {
    onChange(selectedIds.filter(id => id !== gameId))
  }

  const selectedGames = useMemo(() => 
    games.filter(game => selectedIds.includes(game.id)),
    [games, selectedIds]
  )

  const filteredGames = useMemo(() => {
    if (!searchTerm) return games
    const term = searchTerm.toLowerCase()
    return games.filter(
      game =>
        game.title.toLowerCase().includes(term) ||
        game.platforms.some(p => p.name.toLowerCase().includes(term))
    )
  }, [games, searchTerm])

  return (
    <FormControl isInvalid={!!error}>
      <VStack align="stretch" spacing={3}>
        <Button
          size="sm"
          onClick={onOpen}
          colorScheme="blue"
          variant="outline"
          leftIcon={<AddIcon />}
        >
          Sélectionner des jeux
        </Button>

        <Wrap spacing={2}>
          {selectedGames.map(game => (
            <WrapItem key={game.id}>
              <Tag
                size="md"
                borderRadius="full"
                variant="subtle"
                colorScheme="blue"
              >
                <TagLabel>{game.title}</TagLabel>
                <TagCloseButton onClick={() => removeGame(game.id)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner des jeux</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GameSelectorList
              games={filteredGames}
              selectedGames={tempSelectedIds}
              onGameSelect={handleGameToggle}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Text color="gray.500">
                {tempSelectedIds.length} jeu{tempSelectedIds.length > 1 ? 'x' : ''} sélectionné{tempSelectedIds.length > 1 ? 's' : ''}
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

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}
