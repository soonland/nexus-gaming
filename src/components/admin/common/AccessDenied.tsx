'use client';

import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import { AdminPageLayout } from '../layout/AdminPageLayout';

interface IAccessDeniedProps {
  message?: string;
  returnPath: string;
  returnLabel?: string;
}

export const AccessDenied = ({
  message = "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource",
  returnPath,
  returnLabel = 'Retour',
}: IAccessDeniedProps) => (
  <AdminPageLayout title='Accès non autorisé'>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        py: 4,
      }}
    >
      <Typography color='error' variant='h6'>
        {message}
      </Typography>
      <Button
        component={Link}
        href={returnPath}
        startIcon={<FiArrowLeft />}
        variant='outlined'
      >
        {returnLabel}
      </Button>
    </Box>
  </AdminPageLayout>
);
