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
      <AdminList error={error} isLoading={isLoading}>
        {category && (
          <CategoryForm
            initialData={{
              id: category.id,
              name: category.name,
              description: category.description,
              color: category.color,
              isDefault: category.isDefault,
              parentId: category.parentId,
            }}
            mode='edit'
          />
        )}
      </AdminList>
    </AdminPageLayout>
  );
};

export default EditCategoryPage;
