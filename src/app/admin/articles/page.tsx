'use client'

import React, { useState, useMemo, useRef } from 'react'
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
import { BiFilter } from 'react-icons/bi'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useArticles } from '@/hooks/useArticles'
import { useUsers } from '@/hooks/useUsers'
import { useCategories } from '@/hooks/useCategories'
import { DateDisplay } from '@/components/common/DateDisplay'
import { FiltersPanel } from './_components/FiltersPanel'
import type { ArticleStatus } from '@/types'

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

export default function ArticlesPage() {
  // Hooks
  const searchParams = useSearchParams()
  const toast = useToast()
  const deleteDialog = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // State
  const [page, setPage] = useState(parseInt(searchParams.get('page') ?? '1'))
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<ArticleStatus[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

  // Queries
  const { data, deleteArticle, isLoading, isDeleting } = useArticles({
    page: page.toString(),
    limit: limit.toString(),
    search: searchTerm,
    status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
  })
  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const { categories, isLoading: isLoadingCategories } = useCategories()

  // Memoized values
  const hasActiveFilters = useMemo(() => {
    return searchTerm || selectedUser || selectedCategory || selectedStatuses.length > 0
  }, [searchTerm, selectedUser, selectedCategory, selectedStatuses])

  const activeFiltersCount = useMemo(() => (
    [
      searchTerm ? 1 : 0,
      selectedUser ? 1 : 0,
      selectedCategory ? 1 : 0,
      selectedStatuses.length
    ].reduce((a, b) => a + b, 0)
  ), [searchTerm, selectedUser, selectedCategory, selectedStatuses])

  const statusCounts = useMemo(() => {
    const initialCounts = {
      DRAFT: 0,
      PENDING_APPROVAL: 0,
      PUBLISHED: 0,
      ARCHIVED: 0
    }
    if (!data?.articles) return initialCounts
    return data.articles.reduce((acc: Record<ArticleStatus, number>, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1
      return acc
    }, { ...initialCounts })
  }, [data?.articles])

  const filteredArticles = data?.articles || []

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedUser('')
    setSelectedCategory('')
    setSelectedStatuses([])
  }

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
          <HStack mb={4} spacing={4}>
            <HStack flex="1" spacing={4}>
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

            <HStack>
              <Button
                leftIcon={<BiFilter />}
                variant="outline"
                onClick={() => setShowFilters(prev => !prev)}
                colorScheme={hasActiveFilters ? "blue" : "gray"}
              >
                Filtres {hasActiveFilters && `(${activeFiltersCount})`}
              </Button>
            </HStack>
          </HStack>

          <FiltersPanel 
            isVisible={showFilters}
            selectedUser={selectedUser}
            selectedCategory={selectedCategory}
            selectedStatuses={selectedStatuses}
            users={users}
            categories={categories ?? []}
            statusCounts={statusCounts}
            hasActiveFilters={Boolean(hasActiveFilters)}
            filteredCount={filteredArticles.length}
            totalCount={data?.articles?.length || 0}
            isLoadingUsers={isLoadingUsers}
            isLoadingCategories={isLoadingCategories}
            onUserChange={setSelectedUser}
            onCategoryChange={setSelectedCategory}
            onStatusesChange={setSelectedStatuses}
            onReset={handleResetFilters}
          />

          <Box mt={4} overflowX="auto" borderWidth="1px" borderColor={borderColor} rounded="lg">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Titre</Th>
                  <Th>Catégorie</Th>
                  <Th>Auteur</Th>
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
                    <Td>{article.user.username}</Td>
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
                          target="_blank"
                          rel="noopener noreferrer"
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

          {data?.pagination && data.pagination.pages > 1 && (
            <HStack justify="center" spacing={2} mt={4}>
              {Array.from({ length: data.pagination.pages }, (_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
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
