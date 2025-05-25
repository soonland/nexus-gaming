'use client';

import { Alert, Box, Container, Stack } from '@mui/material';

import { useAnnouncements } from '@/hooks/useAnnouncements';

const severityMap = {
  INFO: 'info',
  ATTENTION: 'warning',
  URGENT: 'error',
} as const;

export const PublicAnnouncements = () => {
  const { announcements = [] } = useAnnouncements();

  if (announcements.length === 0) return null;

  return (
    <Container maxWidth='lg' sx={{ py: 0.5 }}>
      <Box>
        <Stack spacing={1}>
          {announcements.map(announcement => {
            const severity = severityMap[announcement.type];

            return (
              <Alert
                key={announcement.id}
                severity={severity}
                sx={{
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  },
                  'position': 'relative',
                }}
                variant='filled'
              >
                {announcement.message}
              </Alert>
            );
          })}
        </Stack>
      </Box>
    </Container>
  );
};
