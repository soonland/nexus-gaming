'use client';

import { AdminPageLayout } from '@/components/admin/common';

import { CategoryForm } from '../_components/CategoryForm';

const NewCategoryPage = () => {
  return (
    <AdminPageLayout title='Ajouter une catégorie'>
      <CategoryForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewCategoryPage;
