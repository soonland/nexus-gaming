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

import { useCategories } from '@/hooks/useCategories';

export default function CategoriesPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, deleteCategory, isDeleting } = useCategories();
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Filtrage des catégories
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete);
      toast({
        title: 'Catégorie supprimée',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      deleteDialog.onClose();
      setCategoryToDelete(null);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la catégorie',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW='container.xl' py={8}>
      <VStack align='stretch' spacing={8}>
        <HStack justify='space-between'>
          <Heading size='lg'>Gestion des catégories</Heading>
          <Button
            as={Link}
            colorScheme='blue'
            href='/admin/categories/new'
            leftIcon={<AddIcon />}
          >
            Ajouter une catégorie
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
                  <Th>Nombre d'articles</Th>
                  <Th width='100px'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCategories.map(category => (
                  <Tr key={category.id}>
                    <Td>{category.name}</Td>
                    <Td>{category.articleCount}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label='Modifier'
                          as={Link}
                          colorScheme='blue'
                          href={`/admin/categories/${category.id}/edit`}
                          icon={<EditIcon />}
                          size='sm'
                        />
                        <IconButton
                          aria-label='Supprimer'
                          colorScheme='red'
                          icon={<DeleteIcon />}
                          isLoading={isDeleting}
                          size='sm'
                          onClick={() => handleDeleteClick(category.id)}
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
            <AlertDialogHeader>Supprimer la catégorie</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action
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
}
