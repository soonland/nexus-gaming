'use client';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import Link from 'next/link';

interface IAdminActionsProps {
  createHref?: string;
  createLabel?: string;
  extra?: React.ReactNode;
}

export const AdminActions = ({
  createHref,
  createLabel = 'Créer',
  extra,
}: IAdminActionsProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {createHref && (
        <Button
          component={Link}
          href={createHref}
          startIcon={<AddIcon />}
          variant='contained'
        >
          {createLabel}
        </Button>
      )}
      {extra}
    </Box>
  );
};
