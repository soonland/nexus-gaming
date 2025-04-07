'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  useToast,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ExternalLinkIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { useGames } from '@/hooks/useGames'
import { DateDisplay } from '@/components/common/DateDisplay'
import GameListLoading from '@/components/loading/GameListLoading'

export default function GamesPage() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const { games, deleteGame, isLoading, isDeleting } = useGames()
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Filtrage des jeux
  const filteredGames = useMemo(() => {
    if (!games) return []
    
    const searchString = searchTerm.toLowerCase()
    return games.filter(game => {
      return (
        game.title.toLowerCase().includes(searchString) ||
        game.developer.name.toLowerCase().includes(searchString) ||
        game.publisher.name.toLowerCase().includes(searchString) ||
        game.platforms.some(platform => platform.name.toLowerCase().includes(searchString))
      )
    })
  }, [games, searchTerm])

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      try {
        await deleteGame(id)
        toast({
          title: 'Jeu supprimé',
          status: 'success',
          duration: 3000,
        })
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Une erreur est survenue lors de la suppression",
          status: 'error',
          duration: 5000,
        })
      }
    }
  }

  if (isLoading) {
    return <GameListLoading />
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gestion des jeux</Heading>
          <Button
            as={Link}
            href="/admin/games/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Nouveau jeu
          </Button>
        </HStack>

        <Box>
          <HStack mb={4}>
            <InputGroup maxW="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            {searchTerm && (
              <IconButton
                icon={<CloseIcon />}
                aria-label="Clear search"
                size="sm"
                onClick={() => setSearchTerm('')}
              />
            )}
          </HStack>

          <Box overflowX="auto" borderWidth="1px" borderColor={borderColor} rounded="lg">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Titre</Th>
                  <Th>Développeur</Th>
                  <Th>Éditeur</Th>
                  <Th>Date de sortie</Th>
                  <Th>Plateformes</Th>
                  <Th width="150px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredGames.map((game) => (
                  <Tr key={game.id}>
                    <Td>{game.title}</Td>
                    <Td>{game.developer.name}</Td>
                    <Td>{game.publisher.name}</Td>
                    <Td>
                      {game.releaseDate && (
                        <DateDisplay date={game.releaseDate} format="long" />
                      )}
                    </Td>
                    <Td>
                      <Wrap>
                        {game.platforms.map((platform) => (
                          <WrapItem key={platform.id}>
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              fontSize="xs"
                            >
                              {platform.name}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          as={Link}
                          href={`/admin/games/${game.id}/edit`}
                          icon={<EditIcon />}
                          aria-label="Modifier"
                          size="sm"
                          colorScheme="blue"
                        />
                        <IconButton
                          as={Link}
                          href={`/games/${game.id}`}
                          icon={<ExternalLinkIcon />}
                          aria-label="Voir"
                          size="sm"
                          colorScheme="green"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Supprimer"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(game.id)}
                          isLoading={isDeleting}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Container>
  )
}
