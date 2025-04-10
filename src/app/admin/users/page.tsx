'use client'

import {
  Container,
  Heading,
  Button,
  HStack,
  VStack,
  Input,
  Select,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { BiPlus, BiSearch } from 'react-icons/bi'
import UsersTable from './_components/UsersTable'
import { useUsers, useDeleteUser, useToggleUserStatus } from '@/hooks/useUsers'

export default function UserListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const deleteDialog = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  
  // State
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Queries and Mutations
  const { data, isLoading } = useUsers({
    page: page.toString(),
    limit: limit.toString(),
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
  })

  const deleteUserMutation = useDeleteUser()
  const toggleStatusMutation = useToggleUserStatus()

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateURL({ search: value || null, page: '1' })
  }

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
    updateURL({ role: value || null, page: '1' })
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    updateURL({ status: value || null, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage.toString() })
  }

  const updateURL = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })

    router.push(`/admin/users?${current.toString()}`)
  }

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    deleteDialog.onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      await deleteUserMutation.mutateAsync(userToDelete)
      toast({
        title: 'User deleted',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete user',
        status: 'error',
        duration: 5000,
      })
    } finally {
      deleteDialog.onClose()
      setUserToDelete(null)
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive })
      toast({
        title: `User ${isActive ? 'activated' : 'deactivated'}`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user status',
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Users</Heading>
          <Button
            leftIcon={<BiPlus />}
            colorScheme="blue"
            onClick={() => router.push('/admin/users/new')}
          >
            Add User
          </Button>
        </HStack>

        <HStack spacing={4}>
          <InputGroup maxW="300px">
            <InputLeftElement>
              <BiSearch />
            </InputLeftElement>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>

          <Select
            placeholder="Filter by role"
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            maxW="200px"
          >
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="EDITOR">Editor</option>
            <option value="USER">User</option>
          </Select>

          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            maxW="200px"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </HStack>

        <Box>
          <UsersTable
            users={data?.users || []}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteClick}
          />
        </Box>

        {data?.pagination && (
          <HStack justify="center" spacing={2}>
            {Array.from({ length: data.pagination.pages }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={page === i + 1 ? 'solid' : 'outline'}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </HStack>
        )}
      </VStack>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete User</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteUserMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}
