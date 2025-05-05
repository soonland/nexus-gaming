'use client';

import { Box, Container, Stack, Typography, useTheme } from '@mui/material';

interface IAdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export const AdminPageLayout = ({
  children,
  title,
  subtitle,
  actions,
}: IAdminPageLayoutProps) => {
  const theme = useTheme();

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              component='h1'
              sx={{
                color: theme.palette.text.primary,
              }}
              variant='h4'
            >
              {title}
            </Typography>
            {actions && <Box>{actions}</Box>}
          </Box>
          {subtitle}
        </Stack>
        {children}
      </Stack>
    </Container>
  );
};
