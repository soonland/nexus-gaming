'use client';

import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ExternalLinkIcon,
  CloseIcon,
} from '@chakra-ui/icons';
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useRef } from 'react';

import { DateDisplay } from '@/components/common/DateDisplay';
import GameListLoading from '@/components/loading/GameListLoading';
import { useGames } from '@/hooks/useGames';

const GamesPage = () => {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get('page') ?? '1'));
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, deleteGame, isLoading, isDeleting } = useGames({
    page: page.toString(),
    limit: limit.toString(),
    search: searchTerm,
  });
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  // Filtrage des jeux
  const filteredGames = data?.games || [];

  const handleDeleteClick = (id: string) => {
    setGameToDelete(id);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!gameToDelete) return;

    try {
      await deleteGame(gameToDelete);
      toast({
        title: 'Jeu supprimé',
        status: 'success',
        duration: 3000,
      });
      deleteDialog.onClose();
      setGameToDelete(null);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return <GameListLoading />;
  }

  return (
    <Container maxW='container.xl' py={8}>
      <VStack align='stretch' spacing={8}>
        <HStack justify='space-between'>
          <Heading size='lg'>Gestion des jeux</Heading>
          <Button
            as={Link}
            colorScheme='blue'
            href='/admin/games/new'
            leftIcon={<AddIcon />}
          >
            Nouveau jeu
          </Button>
        </HStack>

        <Box>
          <HStack mb={4}>
            <InputGroup maxW='sm'>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' />
              </InputLeftElement>
              <Input
                placeholder='Rechercher...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            {searchTerm && (
              <IconButton
                aria-label='Clear search'
                icon={<CloseIcon />}
                size='sm'
                onClick={() => setSearchTerm('')}
              />
            )}
          </HStack>

          <Box
            borderColor={borderColor}
            borderWidth='1px'
            overflowX='auto'
            rounded='lg'
          >
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Titre</Th>
                  <Th>Développeur</Th>
                  <Th>Éditeur</Th>
                  <Th>Date de sortie</Th>
                  <Th>Plateformes</Th>
                  <Th width='150px'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredGames.map(game => (
                  <Tr key={game.id}>
                    <Td>{game.title}</Td>
                    <Td>{game.developer.name}</Td>
                    <Td>{game.publisher.name}</Td>
                    <Td>
                      {game.releaseDate && (
                        <DateDisplay date={game.releaseDate} format='long' />
                      )}
                    </Td>
                    <Td>
                      <Wrap>
                        {game.platforms.map(platform => (
                          <WrapItem key={platform.id}>
                            <Badge
                              colorScheme='blue'
                              fontSize='xs'
                              variant='subtle'
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
                          aria-label='Modifier'
                          as={Link}
                          colorScheme='blue'
                          href={`/admin/games/${game.id}/edit`}
                          icon={<EditIcon />}
                          size='sm'
                        />
                        <IconButton
                          aria-label='Voir'
                          as={Link}
                          colorScheme='green'
                          href={`/games/${game.id}`}
                          icon={<ExternalLinkIcon />}
                          rel='noopener noreferrer'
                          size='sm'
                          target='_blank'
                        />
                        <IconButton
                          aria-label='Supprimer'
                          colorScheme='red'
                          icon={<DeleteIcon />}
                          isLoading={isDeleting}
                          size='sm'
                          onClick={() => handleDeleteClick(game.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {data?.pagination && data.pagination.pages > 1 && (
            <HStack justify='center' mt={4} spacing={2}>
              {Array.from({ length: data.pagination.pages }, (_, i) => (
                <Button
                  key={i + 1}
                  size='sm'
                  variant={page === i + 1 ? 'solid' : 'outline'}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </HStack>
          )}
        </Box>
      </VStack>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Supprimer le jeu</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer ce jeu ? Cette action ne peut
              pas être annulée.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Annuler
              </Button>
              <Button
                colorScheme='red'
                isLoading={isDeleting}
                ml={3}
                onClick={handleDeleteConfirm}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default GamesPage;
