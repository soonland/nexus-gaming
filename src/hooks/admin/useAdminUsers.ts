import { Role } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '@/hooks/useAuth';
import { canToggleUserStatus } from '@/lib/permissions';

export interface IUserData {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  deactivationRequestedAt?: string;
  createdAt: string;
  updatedAt: string;
  lastPasswordChange?: string;
  _count?: {
    articles: number;
  };
}

interface IAdminUserParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: boolean | undefined;
  sortField?: keyof Pick<
    IUserData,
    'username' | 'email' | 'role' | 'createdAt' | 'updatedAt'
  >;
  sortOrder?: 'asc' | 'desc';
}

interface IUsersResponse {
  users: IUserData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
}

interface IUpdateUserData {
  username: string;
  email: string;
  password?: string;
  role: Role;
  isActive: boolean;
}

interface IToggleStatusResponse {
  success: boolean;
  message: string;
  deactivationEffectiveDate?: string;
}

const adminUsersApi = {
  getOne: async (id: string) => {
    const { data } = await axios.get(`/api/admin/users/${id}`);
    return data.user as IUserData;
  },

  getAll: async (params: IAdminUserParams = {}) => {
    const queryParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );
    const { data } = await axios.get(`/api/users?${queryParams.toString()}`);
    return data as IUsersResponse;
  },

  create: async (userData: ICreateUserData) => {
    const { data } = await axios.post('/api/users', userData);
    return data.user as IUserData;
  },

  update: async (id: string, userData: IUpdateUserData) => {
    const { data } = await axios.put(`/api/admin/users/${id}`, userData);
    return data.user as IUserData;
  },

  delete: async (id: string) => {
    await axios.delete(`/api/admin/users/${id}`);
  },

  toggleStatus: async (id: string, isActive: boolean) => {
    const { data } = await axios.patch(`/api/admin/users/${id}/status`, {
      isActive,
    });
    return data as IToggleStatusResponse;
  },

  cancelDeactivation: async (id: string) => {
    const { data } = await axios.patch(
      `/api/admin/users/${id}/cancel-deactivation`
    );
    return data as IUserData;
  },
};

const queryKeys = {
  all: ['admin', 'users'] as const,
  lists: (params: IAdminUserParams = {}) => [...queryKeys.all, params] as const,
  details: (id: string) => [...queryKeys.all, id] as const,
};

export function useAdminUser(id: string) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<IUserData>({
    queryKey: queryKeys.details(id),
    queryFn: () => adminUsersApi.getOne(id),
    enabled: !!id,
  });

  return {
    user,
    isLoading,
    error,
  };
}

export function useAdminUsers(params: IAdminUserParams = {}) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const currentQueryKey = queryKeys.lists(params);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.lists(params),
    queryFn: () => adminUsersApi.getAll(params),
  });

  const createUser = useMutation({
    mutationFn: (data: ICreateUserData) => adminUsersApi.create(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserData }) =>
      adminUsersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
      queryClient.refetchQueries({
        queryKey: queryKeys.details(id),
        exact: true,
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: adminUsersApi.delete,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      // Vérifier les permissions
      const targetUser = data?.users.find(u => u.id === id);
      if (!targetUser || !currentUser) {
        throw new Error('Utilisateur non trouvé');
      }

      if (!canToggleUserStatus(currentUser.role, currentUser.id, targetUser)) {
        throw new Error('Permission refusée');
      }

      // Si c'est une désactivation d'admin, vérifier qu'il reste au moins un autre admin
      if (
        !isActive &&
        targetUser.role === Role.SYSADMIN &&
        data?.users.filter(
          u => u.role === Role.SYSADMIN && u.isActive && u.id !== id
        ).length === 0
      ) {
        throw new Error(
          'Il doit rester au moins un administrateur système actif'
        );
      }

      return adminUsersApi.toggleStatus(id, isActive);
    },
    onSuccess: (_, { id }) => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
      queryClient.refetchQueries({
        queryKey: queryKeys.details(id),
        exact: true,
      });
    },
  });

  const cancelDeactivation = useMutation({
    mutationFn: (id: string) => adminUsersApi.cancelDeactivation(id),
    onSuccess: (_, id) => {
      queryClient.refetchQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
      queryClient.refetchQueries({
        queryKey: queryKeys.details(id),
        exact: true,
      });
    },
  });

  return {
    users: data?.users ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    cancelDeactivation,
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending,
    isTogglingStatus: toggleUserStatus.isPending,
  };
}
