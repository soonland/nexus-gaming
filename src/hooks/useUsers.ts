import type { Role } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface IUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: string;
}

export interface IUserData {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastPasswordChange?: string;
  _count?: {
    articles: number;
  };
}

export interface IUsersResponse {
  users: IUserData[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface IUserResponse {
  user: IUserData;
}

export interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
}

export interface IUpdateUserData {
  username: string;
  email: string;
  password?: string;
  role: Role;
  isActive: boolean;
}

const fetchUsers = async (
  params: IUserQueryParams = {}
): Promise<IUsersResponse> => {
  const queryParams = new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  );
  const response = await fetch(`/api/users?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const fetchUser = async (id: string): Promise<IUserData> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  const data: IUserResponse = await response.json();
  return data.user;
};

const createUser = async (data: ICreateUserData): Promise<IUserData> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user');
  }
  const result: IUserResponse = await response.json();
  return result.user;
};

const updateUser = async (
  id: string,
  data: IUpdateUserData
): Promise<IUserData> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }
  const result: IUserResponse = await response.json();
  return result.user;
};

const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
};

const toggleUserStatus = async (
  id: string,
  isActive: boolean
): Promise<IUserData> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user status');
  }
  const result: IUserResponse = await response.json();
  return result.user;
};

export function useUsers(params: IUserQueryParams = {}) {
  return useQuery<IUsersResponse>({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery<IUserData>({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateUserData) => updateUser(id, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['user', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleUserStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.refetchQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['user', id] });
    },
  });
}
