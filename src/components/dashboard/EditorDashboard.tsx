'use client';

import { Box, Container } from '@mui/material';

import { AnnouncementPanel } from '@/app/admin/announcements/_components/AnnouncementPanel';
import { useAnnouncements } from '@/hooks/useAnnouncements';

export const EditorDashboard = () => {
  const { announcements = [] } = useAnnouncements();

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box mb={6}>
        <AnnouncementPanel announcements={announcements} />
      </Box>
    </Container>
  );
};
