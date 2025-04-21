'use client';

import { useParams } from 'next/navigation';

import { AdminList, AdminPageLayout } from '@/components/admin';
import { useCategory } from '@/hooks/useCategories';

import { CategoryForm } from '../../_components/CategoryForm';

const EditCategoryPage = () => {
  const params = useParams();
  const { category, isLoading, error } = useCategory(params.id as string);

  return (
    <AdminPageLayout title='Modifier la catégorie'>
      <AdminList
        emptyMessage='Catégorie introuvable'
        error={error}
        isEmpty={!category}
        isLoading={isLoading}
      >
        {category && (
          <CategoryForm
            initialData={{
              id: category.id,
              name: category.name,
            }}
            mode='edit'
          />
        )}
      </AdminList>
    </AdminPageLayout>
  );
};

export default EditCategoryPage;
