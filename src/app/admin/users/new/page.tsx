'use client'

import {
  Container,
  Heading,
  useToast,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import UserForm from '../_components/UserForm'
import { useCreateUser } from '@/hooks/useUsers'

export default function NewUserPage() {
  const toast = useToast()
  const createUser = useCreateUser()

  const handleSubmit = async (data: any) => {
    try {
      await createUser.mutateAsync(data)
      toast({
        title: 'User created successfully',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user',
        status: 'error',
        duration: 5000,
      })
      throw error // Re-throw to prevent form navigation
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">Create New User</Heading>
        </CardHeader>
        <CardBody>
          <UserForm
            onSubmit={handleSubmit}
            isLoading={createUser.isPending}
          />
        </CardBody>
      </Card>
    </Container>
  )
}
