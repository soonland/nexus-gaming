import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { ICompanyData } from '@/types/api';

interface ICompaniesResponse {
  companies: ICompanyData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface ICompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'developer' | 'publisher';
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ICompanyFormData {
  name: string;
  isDeveloper: boolean;
  isPublisher: boolean;
}

const companiesApi = {
  getAll: async (params: ICompaniesParams = {}) => {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );
    const response = await axios.get(
      `/api/companies?${queryParams.toString()}`
    );
    return response.data as ICompaniesResponse;
  },

  create: async (data: ICompanyFormData) => {
    const response = await axios.post('/api/companies', data);
    return response.data as ICompanyData;
  },

  update: async (id: string, data: ICompanyFormData) => {
    const response = await axios.patch(`/api/companies/${id}`, data);
    return response.data as ICompanyData;
  },

  delete: async (id: string) => {
    await axios.delete(`/api/companies/${id}`);
  },
};

const queryKeys = {
  all: ['companies'] as const,
  lists: (params: ICompaniesParams = {}) => [...queryKeys.all, params] as const,
  filtered: (role: 'developer' | 'publisher') =>
    [...queryKeys.all, { role, limit: 100 }] as const,
};

export function useCompanies(params: ICompaniesParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ICompaniesResponse>({
    queryKey: queryKeys.lists(params),
    queryFn: () => companiesApi.getAll(params),
  });

  const createCompany = useMutation({
    mutationFn: (data: ICompanyFormData) => companiesApi.create(data),
    onSuccess: newCompany => {
      // Mise à jour optimiste du cache pour toutes les listes
      queryClient.setQueryData<ICompaniesResponse | undefined>(
        queryKeys.lists(),
        old => {
          if (!old) return;
          return {
            ...old,
            companies: [...old.companies, newCompany],
          };
        }
      );

      // Mise à jour des listes filtrées si nécessaire
      if (newCompany.isDeveloper) {
        queryClient.setQueryData<ICompaniesResponse | undefined>(
          queryKeys.filtered('developer'),
          old => {
            if (!old) return;
            return {
              ...old,
              companies: [...old.companies, newCompany],
            };
          }
        );
      }

      if (newCompany.isPublisher) {
        queryClient.setQueryData<ICompaniesResponse | undefined>(
          queryKeys.filtered('publisher'),
          old => {
            if (!old) return;
            return {
              ...old,
              companies: [...old.companies, newCompany],
            };
          }
        );
      }
    },
  });

  const updateCompany = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICompanyFormData }) =>
      companiesApi.update(id, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.all });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: (id: string) => companiesApi.delete(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.all });
    },
  });

  return {
    companies: data?.companies ?? [],
    pagination: data?.pagination,
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
  const { data: company, isLoading } = useQuery<ICompanyData>({
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
