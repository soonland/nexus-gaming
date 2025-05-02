'use client';

import { useParams } from 'next/navigation';

import { AdminList, AdminPageLayout } from '@/components/admin';
import { useUser } from '@/hooks/useUsers';

import { UserForm } from '../../_components/UserForm';

const EditUserPage = () => {
  const params = useParams();
  const { data: user, isLoading, error } = useUser(params.id as string);

  return (
    <AdminPageLayout title='Modifier un utilisateur'>
      <AdminList error={error} isLoading={isLoading}>
        {user && (
          <UserForm
            initialData={{
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
            }}
            mode='edit'
          />
        )}
      </AdminList>
    </AdminPageLayout>
  );
};

export default EditUserPage;
