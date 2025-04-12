'use client';

import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { AdminAnnouncementBanner } from '@/components/admin/AdminAnnouncementBanner';
import { useAuth } from '@/hooks/useAuth';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !['ADMIN', 'SYSADMIN'].includes(user.role))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !['ADMIN', 'SYSADMIN'].includes(user.role)) {
    return null;
  }

  return (
    <Box>
      <AdminAnnouncementBanner />
      <Box>{children}</Box>
    </Box>
  );
};

export default AdminLayout;
