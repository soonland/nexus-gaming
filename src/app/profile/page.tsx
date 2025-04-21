'use client';

import { Container, Paper } from '@mui/material';
import { redirect } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

import { ProfileForm } from './ProfileForm';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <ProfileForm />
      </Paper>
    </Container>
  );
};

export default ProfilePage;
