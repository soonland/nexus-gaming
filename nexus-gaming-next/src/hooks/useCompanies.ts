import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Company {
  id: string
  name: string
  isDeveloper: boolean
  isPublisher: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    gamesAsDev: number
    gamesAsPub: number
  }
}

interface CompanyFormData {
  name: string
  isDeveloper: boolean
  isPublisher: boolean
}

interface CompanyWithGames extends Company {
  gamesAsDev: {
    id: string
    title: string
  }[]
  gamesAsPub: {
    id: string
    title: string
  }[]
}

// Hook principal pour la gestion des sociétés
export function useCompanies() {
  const queryClient = useQueryClient()

  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await axios.get('/api/companies')
      return response.data
    },
  })

  const createCompany = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const response = await axios.post('/api/companies', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const updateCompany = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: CompanyFormData
    }) => {
      const response = await axios.patch(`/api/companies/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/companies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  return {
    companies,
    isLoading,
    createCompany: createCompany.mutate,
    updateCompany: updateCompany.mutate,
    deleteCompany: deleteCompany.mutate,
    isCreating: createCompany.isPending,
    isUpdating: updateCompany.isPending,
    isDeleting: deleteCompany.isPending,
  }
}

// Hook pour les détails d'une société
export function useCompany(id: string) {
  const { data: company, isLoading } = useQuery<CompanyWithGames>({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await axios.get(`/api/companies/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  return {
    company,
    isLoading,
  }
}
