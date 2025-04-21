'use client';

import { useParams } from 'next/navigation';

import { AdminPageLayout } from '@/components/admin';
import { useCompany } from '@/hooks/useCompanies';

import { CompanyForm } from '../../_components/CompanyForm';

const EditCompanyPage = () => {
  const params = useParams();
  const { company } = useCompany(params.id as string);

  if (!company) {
    return null;
  }

  return (
    <AdminPageLayout title='Modifier une société'>
      <CompanyForm
        initialData={{
          id: company.id,
          name: company.name,
          isDeveloper: company.isDeveloper,
          isPublisher: company.isPublisher,
        }}
        mode='edit'
      />
    </AdminPageLayout>
  );
};

export default EditCompanyPage;
