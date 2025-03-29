import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Category } from '../../types/category'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/api/categories'
import { CategoryForm } from './CategoryForm'

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories',
        status: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    onOpen()
  }

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(categoryId)
        await fetchCategories()
        toast({
          title: 'Succès',
          description: 'Catégorie supprimée avec succès',
          status: 'success',
        })
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la catégorie',
          status: 'error',
        })
      }
    }
  }

  const handleAddNew = () => {
    setSelectedCategory(null)
    onOpen()
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner />
      </Flex>
    )
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Catégories</Heading>
        <Button colorScheme="blue" onClick={handleAddNew}>
          Ajouter une catégorie
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nom</Th>
            <Th>Date de création</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>{new Date(category.createdAt).toLocaleDateString()}</Td>
              <Td>
                <IconButton
                  aria-label="Modifier"
                  icon={<EditIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => handleEdit(category)}
                />
                <IconButton
                  aria-label="Supprimer"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(category.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CategoryForm
              initialData={selectedCategory || undefined}
              onSubmit={async (data) => {
                try {
                  if (selectedCategory) {
                    await updateCategory(selectedCategory.id, data)
                  } else {
                    await createCategory(data)
                  }
                  await fetchCategories()
                  onClose()
                } catch (error) {
                  console.error('Error:', error)
                  throw error
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
