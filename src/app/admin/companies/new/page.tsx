'use client';

import { AdminPageLayout } from '@/components/admin';

import { CompanyForm } from '../_components/CompanyForm';

const NewCompanyPage = () => {
  return (
    <AdminPageLayout title='Créer une société'>
      <CompanyForm mode='create' />
    </AdminPageLayout>
  );
};

export default NewCompanyPage;
