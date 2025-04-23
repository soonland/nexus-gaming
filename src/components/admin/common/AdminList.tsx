'use client';

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

interface IAdminListProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

export const AdminList = ({
  children,
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'Aucun élément trouvé',
  emptyAction,
}: IAdminListProps) => {
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

  if (isEmpty) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack alignItems='center' spacing={2}>
          <Typography color='text.secondary' variant='body1'>
            {emptyMessage}
          </Typography>
          {emptyAction}
        </Stack>
      </Paper>
    );
  }

  return <Box>{children}</Box>;
};
