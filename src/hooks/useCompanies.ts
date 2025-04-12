import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { CompanyData, CompanyWithGamesData, CompanyForm } from '@/types';

// Hook principal pour la gestion des sociétés
export function useCompanies() {
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery<CompanyData[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await axios.get('/api/companies');
      return response.data;
    },
  });

  const createCompany = useMutation({
    mutationFn: async (data: CompanyForm) => {
      const response = await axios.post('/api/companies', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const updateCompany = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CompanyForm }) => {
      const response = await axios.patch(`/api/companies/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return {
    companies,
    isLoading,
    createCompany: createCompany.mutateAsync,
    updateCompany: updateCompany.mutateAsync,
    deleteCompany: deleteCompany.mutateAsync,
    isCreating: createCompany.isPending,
    isUpdating: updateCompany.isPending,
    isDeleting: deleteCompany.isPending,
  };
}

// Hook pour les détails d'une société
export function useCompany(id: string) {
  const { data: company, isLoading } = useQuery<CompanyWithGamesData>({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await axios.get(`/api/companies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    company,
    isLoading,
  };
}
