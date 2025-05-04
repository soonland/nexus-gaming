import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { ICategoryData, ICategoryForm } from '@/types';

const CATEGORIES_QUERY_KEY = ['categories'] as const;

// Hook principal pour la gestion des catégories
export function useCategories() {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<ICategoryData[]>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  const createCategory = useMutation({
    mutationFn: async (data: ICategoryForm) => {
      const response = await axios.post('/api/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ICategoryForm }) => {
      const response = await axios.patch(`/api/categories/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['categories'] });
      queryClient.refetchQueries({ queryKey: ['category', variables.id] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });

  // Get the default category if one exists
  const defaultCategory = categories?.find(category => category.isDefault);

  // Function to set a category as default
  const setDefaultCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await axios.patch(`/api/categories/${categoryId}`, {
        id: categoryId,
        isDefault: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });

  return {
    categories,
    defaultCategory,
    error,
    isLoading,
    createCategory: createCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    setDefaultCategory: setDefaultCategory.mutateAsync,
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
    isDeleting: deleteCategory.isPending,
    isSettingDefault: setDefaultCategory.isPending,
  };
}

// Hook pour les détails d'une catégorie
export function useCategory(id: string) {
  const {
    data: category,
    isLoading,
    error,
  } = useQuery<ICategoryData>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await axios.get(`/api/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    category,
    isLoading,
    error,
  };
}
