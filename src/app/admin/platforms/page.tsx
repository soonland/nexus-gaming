'use client';

import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
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
  useToast,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState, useMemo, useRef } from 'react';

import { DateDisplay } from '@/components/common/DateDisplay';
import { usePlatforms } from '@/hooks/usePlatforms';

const PlatformsPage = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const { platforms, deletePlatform, isDeleting } = usePlatforms();
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [platformToDelete, setPlatformToDelete] = useState<string | null>(null);

  // Filtrage des plateformes
  const filteredPlatforms = useMemo(() => {
    if (!platforms) return [];

    return platforms.filter(platform => {
      const searchString = searchTerm.toLowerCase();
      return (
        platform.name.toLowerCase().includes(searchString) ||
        platform.manufacturer.toLowerCase().includes(searchString)
      );
    });
  }, [platforms, searchTerm]);

  const handleDeleteClick = (id: string) => {
    setPlatformToDelete(id);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!platformToDelete) return;

    try {
      await deletePlatform(platformToDelete);
      toast({
        title: 'Plateforme supprimée',
        status: 'success',
        duration: 3000,
      });
      deleteDialog.onClose();
      setPlatformToDelete(null);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW='container.xl' py={8}>
      <VStack align='stretch' spacing={8}>
        <HStack justify='space-between'>
          <Heading size='lg'>Gestion des plateformes</Heading>
          <Button
            as={Link}
            colorScheme='blue'
            href='/admin/platforms/new'
            leftIcon={<AddIcon />}
          >
            Ajouter une plateforme
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
                  <Th>Nom</Th>
                  <Th>Fabricant</Th>
                  <Th>Date de sortie</Th>
                  <Th>Nombre de jeux</Th>
                  <Th width='100px'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPlatforms.map(platform => (
                  <Tr key={platform.id}>
                    <Td>{platform.name}</Td>
                    <Td>{platform.manufacturer}</Td>
                    <Td>
                      {platform.releaseDate && (
                        <DateDisplay
                          date={platform.releaseDate}
                          format='short'
                        />
                      )}
                    </Td>
                    <Td>{platform.games?.length || 0}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label='Modifier'
                          as={Link}
                          colorScheme='blue'
                          href={`/admin/platforms/${platform.id}/edit`}
                          icon={<EditIcon />}
                          size='sm'
                        />
                        <IconButton
                          aria-label='Supprimer'
                          colorScheme='red'
                          icon={<DeleteIcon />}
                          isLoading={isDeleting}
                          size='sm'
                          onClick={() => handleDeleteClick(platform.id)}
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

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Supprimer la plateforme</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cette plateforme ? Cette action
              ne peut pas être annulée.
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

export default PlatformsPage;
