'use client';

import {
  Container,
  useToast,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';

import CategoryForm from '@/app/admin/categories/_components/CategoryForm';
import CategoryFormLoading from '@/components/loading/CategoryFormLoading';
import { useCategories, useCategory } from '@/hooks/useCategories';

const EditCategoryPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { category, isLoading: isLoadingCategory, error } = useCategory(id);
  const { updateCategory, isUpdating } = useCategories();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (data: { name: string }) => {
    try {
      await updateCategory({ id, data });
      toast({
        title: 'Catégorie modifiée',
        status: 'success',
        duration: 3000,
      });
      router.push('/admin/categories');
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la catégorie',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (error) {
    return (
      <Container maxW='container.md' py={8}>
        <Alert status='error'>
          <AlertIcon />
          Error loading category
        </Alert>
      </Container>
    );
  }

  if (isLoadingCategory) {
    return (
      <Container maxW='container.md' py={8}>
        <CategoryFormLoading />
      </Container>
    );
  }

  if (!category) {
    return (
      <Container maxW='container.md' py={8}>
        <Alert status='error'>
          <AlertIcon />
          Category not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.md' py={8}>
      <Card>
        <CardHeader>
          <Heading size='lg'>Modifier la catégorie</Heading>
        </CardHeader>
        <CardBody>
          <CategoryForm
            initialData={{ name: category.name }}
            isLoading={isUpdating}
            mode='edit'
            onCancel={() => router.push('/admin/categories')}
            onSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditCategoryPage;
