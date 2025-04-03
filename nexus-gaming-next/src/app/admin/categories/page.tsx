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
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { useCategories } from '@/hooks/useCategories'
import CategoryListLoading from '@/components/loading/CategoryListLoading'

interface Category {
  id: string
  name: string
  articleCount: number
  createdAt: Date
  updatedAt: Date
}

export default function CategoriesPage() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const { categories, deleteCategory, isLoading, isDeleting } = useCategories()
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Filtrage des catégories
  const filteredCategories = useMemo(() => {
    if (!categories) return []
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [categories, searchTerm])

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id)
        toast({
          title: 'Catégorie supprimée',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } catch {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la catégorie',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gestion des catégories</Heading>
          <Button
            as={Link}
            href="/admin/categories/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Ajouter une catégorie
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
                  <Th>Nom</Th>
                  <Th>Nombre d'articles</Th>
                  <Th width="100px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCategories.map((category) => (
                  <Tr key={category.id}>
                    <Td>{category.name}</Td>
                    <Td>{category.articleCount}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          as={Link}
                          href={`/admin/categories/${category.id}/edit`}
                          icon={<EditIcon />}
                          aria-label="Modifier"
                          size="sm"
                          colorScheme="blue"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Supprimer"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(category.id)}
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
