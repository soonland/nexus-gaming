'use client';

import { Box, Container, Stack, Typography } from '@mui/material';

interface IAdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export const AdminPageLayout = ({
  children,
  title,
  actions,
}: IAdminPageLayoutProps) => {
  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography component='h1' variant='h4'>
            {title}
          </Typography>
          {actions && <Box>{actions}</Box>}
        </Box>
        {children}
      </Stack>
    </Container>
  );
};
