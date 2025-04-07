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
import { useArticles } from '@/hooks/useArticles'
import { DateDisplay } from '@/components/common/DateDisplay'
import type { ArticleStatus } from '@/types'

export default function ArticlesPage() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const { articles, deleteArticle, isLoading, isDeleting } = useArticles()
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Filtrage des articles
  const filteredArticles = useMemo(() => {
    if (!articles) return []
    
    const searchString = searchTerm.toLowerCase()
    return articles.filter(article => {
      return (
        article.title.toLowerCase().includes(searchString) ||
        article.category.name.toLowerCase().includes(searchString) ||
        article.games.some(game => game.title.toLowerCase().includes(searchString))
      )
    })
  }, [articles, searchTerm])

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticle(id)
        toast({
          title: 'Article supprimé',
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

  const getStatusBadge = (status: ArticleStatus) => {
    const props = status === 'PUBLISHED'
      ? { colorScheme: 'green', children: 'Publié' }
      : { colorScheme: 'gray', children: 'Brouillon' }
    return <Badge {...props} />
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gestion des articles</Heading>
          <Button
            as={Link}
            href="/admin/articles/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Nouvel article
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
                  <Th>Catégorie</Th>
                  <Th>Status</Th>
                  <Th>Date de publication</Th>
                  <Th width="150px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredArticles.map((article) => (
                  <Tr key={article.id}>
                    <Td>{article.title}</Td>
                    <Td>{article.category.name}</Td>
                    <Td>{getStatusBadge(article.status)}</Td>
                    <Td>
                      {article.publishedAt && (
                        <DateDisplay date={article.publishedAt} format="long" />
                      )}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          as={Link}
                          href={`/admin/articles/${article.id}/edit`}
                          icon={<EditIcon />}
                          aria-label="Modifier"
                          size="sm"
                          colorScheme="blue"
                        />
                        <IconButton
                          as={Link}
                          href={`/articles/${article.id}`}
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
                          onClick={() => handleDelete(article.id)}
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
