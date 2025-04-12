'use client'

import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Button,
  Select,
  Checkbox,
  CheckboxGroup,
  Text,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { BiReset } from 'react-icons/bi'
import type { ArticleStatus, CategoryData } from '@/types'
import type { Role } from '@prisma/client'

interface User {
  id: string
  username: string
  email: string
  role: Role
  isActive: boolean
}

interface FiltersProps {
  isVisible: boolean
  selectedUser: string
  selectedCategory: string
  selectedStatuses: ArticleStatus[]
  users: any
  categories: CategoryData[]
  statusCounts: { [key: string]: number }
  hasActiveFilters: boolean
  filteredCount: number
  totalCount: number
  isLoadingUsers: boolean
  isLoadingCategories: boolean
  onUserChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusesChange: (values: ArticleStatus[]) => void
  onReset: () => void
}

export const FiltersPanel = ({
  isVisible,
  selectedUser,
  selectedCategory,
  selectedStatuses,
  users,
  categories,
  statusCounts,
  hasActiveFilters,
  filteredCount,
  totalCount,
  isLoadingUsers,
  isLoadingCategories,
  onUserChange,
  onCategoryChange,
  onStatusesChange,
  onReset
}: FiltersProps) => {
  const bg = useColorModeValue('gray.50', 'gray.900')

  if (!isVisible) return null

  return (
    <Box
      mt={4}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={bg}
      shadow="sm"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <FormControl>
          <FormLabel>Auteur</FormLabel>
          <Select
            placeholder="Tous les auteurs"
            value={selectedUser}
            onChange={(e) => onUserChange(e.target.value)}
            borderColor={selectedUser ? "blue.500" : undefined}
            _hover={{ borderColor: selectedUser ? "blue.600" : undefined }}
          >
            {!isLoadingUsers && users?.users?.filter((user: User) => user.role !== 'USER').map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Catégorie</FormLabel>
          <Select
            placeholder="Toutes les catégories"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            borderColor={selectedCategory ? "blue.500" : undefined}
            _hover={{ borderColor: selectedCategory ? "blue.600" : undefined }}
          >
            {!isLoadingCategories && categories?.map((category: CategoryData) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Statut</FormLabel>
            <CheckboxGroup 
              value={selectedStatuses}
              onChange={(values) => onStatusesChange(values as ArticleStatus[])}
            >
              <HStack spacing={4} wrap="wrap">
                <Checkbox value="DRAFT" colorScheme="yellow">
                  <Text>🔸 Brouillon ({statusCounts.DRAFT})</Text>
                </Checkbox>
                <Checkbox value="PENDING_APPROVAL" colorScheme="orange">
                  <Text>🔶 En attente ({statusCounts.PENDING_APPROVAL})</Text>
                </Checkbox>
                <Checkbox value="PUBLISHED" colorScheme="green">
                  <Text>🟢 Publié ({statusCounts.PUBLISHED})</Text>
                </Checkbox>
                <Checkbox value="ARCHIVED" colorScheme="gray">
                  <Text>⚪ Archivé ({statusCounts.ARCHIVED})</Text>
                </Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
      </Grid>
      <Box mt={6} pt={4} borderTopWidth={1}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="sm" color="gray.500">
            {filteredCount} article{filteredCount > 1 ? 's' : ''} trouvé{filteredCount > 1 ? 's' : ''}
            {hasActiveFilters && ` sur ${totalCount}`}
          </Text>
          <Button
            leftIcon={<BiReset />}
            variant="outline"
            size="sm"
            onClick={onReset}
            colorScheme="red"
            isDisabled={!hasActiveFilters}
          >
            Réinitialiser les filtres
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}
