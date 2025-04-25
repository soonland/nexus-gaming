'use client';

import { Container, Paper } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';

import { NotificationSettings } from './_components/NotificationSettings';
import { ProfileForm } from './ProfileForm';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <ProfileForm />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <NotificationSettings />
      </Paper>
    </Container>
  );
};

export default ProfilePage;
