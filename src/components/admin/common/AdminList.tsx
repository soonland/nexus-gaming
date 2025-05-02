'use client';

import { Alert, Box, CircularProgress } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

interface IAdminListProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
}

export const AdminList = ({ children, isLoading, error }: IAdminListProps) => {
  if (error) {
    return (
      <Alert icon={<FiAlertTriangle />} severity='error' variant='outlined'>
        Une erreur est survenue lors du chargement des données
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Box>{children}</Box>;
};
