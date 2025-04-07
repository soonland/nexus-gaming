'use client'

import React, { useState, useMemo, useRef } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
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
  Select,
  Checkbox,
  CheckboxGroup,
  Text,
  useToast,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
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
  const [selectedStatuses, setSelectedStatuses] = useState<ArticleStatus[]>([])
  const { articles, deleteArticle, isLoading, isDeleting } = useArticles()
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')
  const deleteDialog = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

  // Stats des articles par statut
  const statusCounts = useMemo(() => {
    const initialCounts = {
      DRAFT: 0,
      PENDING_APPROVAL: 0,
      PUBLISHED: 0,
      ARCHIVED: 0
    }
    if (!articles) return initialCounts
    return articles.reduce((acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1
      return acc
    }, { ...initialCounts })
  }, [articles])

  // Filtrage des articles
  const filteredArticles = useMemo(() => {
    if (!articles) return []
    
    const searchString = searchTerm.toLowerCase()
    return articles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchString) ||
        article.category.name.toLowerCase().includes(searchString) ||
        article.games.some(game => game.title.toLowerCase().includes(searchString))
      
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(article.status)
      
      return matchesSearch && matchesStatus
    })
  }, [articles, searchTerm, selectedStatuses])

  const handleDeleteClick = (id: string) => {
    setArticleToDelete(id)
    deleteDialog.onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return

    try {
      await deleteArticle(articleToDelete)
      toast({
        title: 'Article supprimé',
        status: 'success',
        duration: 3000,
      })
      deleteDialog.onClose()
      setArticleToDelete(null)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la suppression",
        status: 'error',
        duration: 5000,
      })
    }
  }

  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge colorScheme="green">🟢 Publié</Badge>
      case 'PENDING_APPROVAL':
        return <Badge colorScheme="orange">🔶 En attente</Badge>
      case 'ARCHIVED':
        return <Badge colorScheme="gray">⚪ Archivé</Badge>
      default:
        return <Badge colorScheme="yellow">🔸 Brouillon</Badge>
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
          <HStack mb={4} spacing={4} align="flex-start">
            <Box flex="1">
              <HStack>
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
            </Box>

            {/* Filtres par statut */}
            <Box flex="2">
              <FormControl>
                <FormLabel>Filtrer par statut</FormLabel>
                <CheckboxGroup 
                  value={selectedStatuses}
                  onChange={(values) => setSelectedStatuses(values as ArticleStatus[])}
                >
                  <HStack spacing={4} wrap="wrap">
                    <Checkbox 
                      value="DRAFT"
                      colorScheme="yellow"
                    >
                      <HStack>
                        <Text>🔸 Brouillon ({statusCounts.DRAFT})</Text>
                      </HStack>
                    </Checkbox>
                    
                    <Checkbox 
                      value="PENDING_APPROVAL"
                      colorScheme="orange"
                    >
                      <HStack>
                        <Text>🔶 En attente ({statusCounts.PENDING_APPROVAL})</Text>
                      </HStack>
                    </Checkbox>
                    
                    <Checkbox 
                      value="PUBLISHED"
                      colorScheme="green"
                    >
                      <HStack>
                        <Text>🟢 Publié ({statusCounts.PUBLISHED})</Text>
                      </HStack>
                    </Checkbox>
                    
                    <Checkbox 
                      value="ARCHIVED"
                      colorScheme="gray"
                    >
                      <HStack>
                        <Text>⚪ Archivé ({statusCounts.ARCHIVED})</Text>
                      </HStack>
                    </Checkbox>
                  </HStack>
                </CheckboxGroup>
              </FormControl>
            </Box>
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
                          onClick={() => handleDeleteClick(article.id)}
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

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Supprimer l'article</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action ne peut pas être annulée.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Annuler
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={isDeleting}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}
