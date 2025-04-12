'use client';

import {
  Container,
  Heading,
  useToast,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';

import { useUser, useUpdateUser } from '@/hooks/useUsers';

import UserForm from '../../_components/UserForm';

const EditUserPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading: isLoadingUser } = useUser(id);
  const updateUser = useUpdateUser(id);

  if (isLoadingUser) {
    return null; // Loading component will be shown
  }

  if (!data?.user) {
    router.push('/admin/users');
    return null;
  }

  const handleSubmit = async (formData: any) => {
    try {
      await updateUser.mutateAsync(formData);
      toast({
        title: 'User updated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update user',
        status: 'error',
        duration: 5000,
      });
      throw error; // Re-throw to prevent form navigation
    }
  };

  return (
    <Container maxW='container.md' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Edit User</Heading>
        </CardHeader>
        <CardBody>
          <UserForm
            initialData={{
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              role: data.user.role,
            }}
            isLoading={updateUser.isPending}
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditUserPage;
