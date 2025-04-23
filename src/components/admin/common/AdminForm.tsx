'use client';

import { Box, Button, Paper, Stack, Skeleton } from '@mui/material';
import Link from 'next/link';
import { FiSave } from 'react-icons/fi';

import { FormErrorSummary } from './FormErrorSummary';

interface IAdminFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  errors?: Array<{ field: string; message: string }>;
  isSubmitting?: boolean;
  isLoading?: boolean;
  cancelHref?: string;
  submitButton?: React.ReactNode;
  submitButtonSecondary?: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  hideSaveButton?: boolean;
}

export const AdminForm = ({
  children,
  onSubmit,
  errors = [],
  isSubmitting,
  isLoading,
  cancelHref,
  submitButton,
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  hideSaveButton = false,
  submitButtonSecondary,
}: IAdminFormProps) => {
  return (
    <Paper sx={{ p: 4 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          <FormErrorSummary errors={errors} />
          {children}
          <Box
            sx={{
              'display': 'flex',
              'gap': 2,
              'justifyContent': 'flex-end',
              'pt': 2,
              'minHeight': 40,
              'transition': 'opacity 0.2s ease-in-out',
              'opacity': isLoading ? 0.6 : 1,
              '& .MuiSkeleton-root': {
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            {isLoading ? (
              // Show skeleton loaders during loading
              <>
                <>
                  {cancelHref && (
                    <Skeleton height={36} variant='rectangular' width={100} />
                  )}
                  {!hideSaveButton && (
                    <Skeleton height={36} variant='rectangular' width={120} />
                  )}
                  <Skeleton height={36} variant='rectangular' width={120} />
                </>
              </>
            ) : (
              // Show actual buttons when loaded
              <>
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
                {!hideSaveButton && (
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    variant='outlined'
                  >
                    <FiSave style={{ marginRight: '0.5rem' }} />
                    {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
                  </Button>
                )}
                {submitButtonSecondary}
                {submitButton ? (
                  submitButton
                ) : (
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    variant='contained'
                  >
                    {submitLabel}
                  </Button>
                )}
              </>
            )}
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
