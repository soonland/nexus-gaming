'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react'
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { useArticles } from '@/hooks/useArticles'
import { DateDisplay } from '@/components/common/DateDisplay'

export default function ArticlesPage() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const { articles, deleteArticle, isLoading } = useArticles()

  const filteredArticles = useMemo(() => {
    if (!articles) return []
    
    return articles.filter(article => {
      const searchString = searchTerm.toLowerCase()
      return article.title.toLowerCase().includes(searchString)
    })
  }, [articles, searchTerm])

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
          <InputGroup maxW="md" mb={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Titre</Th>
                <Th>Catégorie</Th>
                <Th>Jeux</Th>
                <Th>Auteur</Th>
                <Th>Date</Th>
                <Th width="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredArticles.map((article) => (
                <Tr key={article.id}>
                  <Td>{article.title}</Td>
                  <Td>
                    {article.category ? (
                      <Badge>{article.category.name}</Badge>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      {article.games.map((game) => (
                        <Badge key={game.id} colorScheme="blue">
                          {game.title}
                        </Badge>
                      ))}
                    </HStack>
                  </Td>
                  <Td>{article.user.username}</Td>
                  <Td>
                    <DateDisplay date={article.createdAt} />
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
                        icon={<DeleteIcon />}
                        aria-label="Supprimer"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(article.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  )
}
