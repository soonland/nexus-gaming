'use client';

import { Box, Button, Paper, Stack } from '@mui/material';
import Link from 'next/link';

interface IAdminFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  cancelHref?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

export const AdminForm = ({
  children,
  onSubmit,
  isSubmitting,
  cancelHref,
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
}: IAdminFormProps) => {
  return (
    <Paper sx={{ p: 4 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {children}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              pt: 2,
            }}
          >
            {cancelHref && (
              <Button
                color='inherit'
                component={Link}
                href={cancelHref}
                variant='outlined'
              >
                {cancelLabel}
              </Button>
            )}
            <Button disabled={isSubmitting} type='submit' variant='contained'>
              {submitLabel}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
