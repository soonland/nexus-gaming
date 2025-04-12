'use client';

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
  useColorModeValue,
} from '@chakra-ui/react';
import type { Role } from '@prisma/client';
import { BiReset } from 'react-icons/bi';

import type { ArticleStatus, CategoryData } from '@/types';

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
}

interface FiltersProps {
  isVisible: boolean;
  selectedUser: string;
  selectedCategory: string;
  selectedStatuses: ArticleStatus[];
  users: any;
  categories: CategoryData[];
  statusCounts: { [key: string]: number };
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  isLoadingUsers: boolean;
  isLoadingCategories: boolean;
  onUserChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusesChange: (values: ArticleStatus[]) => void;
  onReset: () => void;
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
  onReset,
}: FiltersProps) => {
  const bg = useColorModeValue('gray.50', 'gray.900');

  if (!isVisible) return null;

  return (
    <Box bg={bg} borderRadius='lg' borderWidth='1px' mt={4} p={4} shadow='sm'>
      <Grid gap={4} templateColumns='repeat(2, 1fr)'>
        <FormControl>
          <FormLabel>Auteur</FormLabel>
          <Select
            _hover={{ borderColor: selectedUser ? 'blue.600' : undefined }}
            borderColor={selectedUser ? 'blue.500' : undefined}
            placeholder='Tous les auteurs'
            value={selectedUser}
            onChange={e => onUserChange(e.target.value)}
          >
            {!isLoadingUsers &&
              users?.users
                ?.filter((user: User) => user.role !== 'USER')
                .map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Catégorie</FormLabel>
          <Select
            _hover={{ borderColor: selectedCategory ? 'blue.600' : undefined }}
            borderColor={selectedCategory ? 'blue.500' : undefined}
            placeholder='Toutes les catégories'
            value={selectedCategory}
            onChange={e => onCategoryChange(e.target.value)}
          >
            {!isLoadingCategories &&
              categories?.map((category: CategoryData) => (
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
              onChange={values => onStatusesChange(values as ArticleStatus[])}
            >
              <HStack spacing={4} wrap='wrap'>
                <Checkbox colorScheme='yellow' value='DRAFT'>
                  <Text>🔸 Brouillon ({statusCounts.DRAFT})</Text>
                </Checkbox>
                <Checkbox colorScheme='orange' value='PENDING_APPROVAL'>
                  <Text>🔶 En attente ({statusCounts.PENDING_APPROVAL})</Text>
                </Checkbox>
                <Checkbox colorScheme='green' value='PUBLISHED'>
                  <Text>🟢 Publié ({statusCounts.PUBLISHED})</Text>
                </Checkbox>
                <Checkbox colorScheme='gray' value='ARCHIVED'>
                  <Text>⚪ Archivé ({statusCounts.ARCHIVED})</Text>
                </Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
      </Grid>
      <Box borderTopWidth={1} mt={6} pt={4}>
        <VStack align='stretch' spacing={4}>
          <Text color='gray.500' fontSize='sm'>
            {filteredCount} article{filteredCount > 1 ? 's' : ''} trouvé
            {filteredCount > 1 ? 's' : ''}
            {hasActiveFilters && ` sur ${totalCount}`}
          </Text>
          <Button
            colorScheme='red'
            isDisabled={!hasActiveFilters}
            leftIcon={<BiReset />}
            size='sm'
            variant='outline'
            onClick={onReset}
          >
            Réinitialiser les filtres
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};
