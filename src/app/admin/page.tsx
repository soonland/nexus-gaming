'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  Collapse,
} from '@mui/material';
import type { AnnouncementType } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import {
  FiUsers,
  FiFileText,
  FiBox,
  FiTag,
  FiMonitor,
  FiBriefcase,
  FiBell,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
} from 'react-icons/fi';

import { getAnnouncementTypeStyle } from '@/app/admin/announcements/_components/announcementStyles';
import { SideColorBadge } from '@/components/common';
import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import { useArticles } from '@/hooks/useArticles';
import { useGames } from '@/hooks/useGames';

const typeIcons: Record<AnnouncementType, React.ElementType> = {
  INFO: FiInfo,
  ATTENTION: FiAlertCircle,
  URGENT: FiAlertTriangle,
};

const AdminCard = ({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon: React.ElementType;
  href: string;
}) => (
  <Card
    component={Link}
    href={href}
    sx={{
      'height': '100%',
      'display': 'flex',
      'flexDirection': 'column',
      'textDecoration': 'none',
      'transition': 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
  >
    <CardContent>
      <Stack alignItems='center' spacing={2}>
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'primary.main',
          }}
        >
          <Icon size={24} />
        </Box>
        <Typography color='text.primary' variant='h6'>
          {title}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const AdminPage = () => {
  const { announcements = [] } = useAdminAnnouncement();
  const { articles: articlesData } = useArticles();
  const { games: gamesData } = useGames();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredAnnouncements = announcements.filter(
    announcement =>
      announcement.isActive === 'active' &&
      (announcement.expiresAt
        ? new Date(announcement.expiresAt) > new Date()
        : true)
  );
  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Annonces */}
      <Box mb={6}>
        <Typography gutterBottom variant='h5'>
          Annonces
        </Typography>
        <Stack spacing={2}>
          {filteredAnnouncements.map(announcement => {
            const type = announcement.type as AnnouncementType;
            const style = getAnnouncementTypeStyle(type);
            const Icon = typeIcons[type];

            return (
              <Card
                key={announcement.id}
                sx={{
                  'transition': 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      alignItems='flex-start'
                      display='flex'
                      justifyContent='space-between'
                    >
                      <Stack spacing={2} width='100%'>
                        <Box alignItems='center' display='flex' gap={2}>
                          <Box alignItems='center' display='flex' gap={1}>
                            <Icon size={20} style={{ color: style.color }} />
                            <SideColorBadge
                              backgroundColor={style.backgroundColor}
                              borderWidth={style.borderWidth}
                              color={style.color}
                              label={style.label}
                            />
                          </Box>
                          {announcement.expiresAt && (
                            <Typography color='text.secondary' variant='body2'>
                              Expire le{' '}
                              {new Date(
                                announcement.expiresAt
                              ).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                        <Collapse
                          collapsedSize={48}
                          in={expandedId === announcement.id}
                          timeout={200}
                        >
                          <Box
                            sx={{
                              'position': 'relative',
                              '&::after':
                                expandedId !== announcement.id
                                  ? {
                                      content: '""',
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      height: '24px',
                                      background:
                                        'linear-gradient(to bottom, transparent, white)',
                                    }
                                  : {},
                            }}
                          >
                            <Typography
                              sx={{
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {announcement.message}
                            </Typography>
                          </Box>
                        </Collapse>
                      </Stack>
                      <IconButton
                        sx={{
                          'transform':
                            expandedId === announcement.id
                              ? 'rotate(180deg)'
                              : 'none',
                          'transition': 'transform 0.2s',
                          'ml': 1,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => toggleExpand(announcement.id)}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

      {/* Statistiques */}
      <Box mb={6}>
        <Typography gutterBottom variant='h5'>
          Statistiques
        </Typography>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant='h6'>
                  Articles
                </Typography>
                <Typography variant='h3'>
                  {articlesData?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant='h6'>
                  Jeux
                </Typography>
                <Typography variant='h3'>{gamesData?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Navigation Administrative */}
      <Box>
        <Typography gutterBottom variant='h5'>
          Navigation
        </Typography>
        <Grid container spacing={3}>
          <Grid size={4}>
            <AdminCard
              href='/admin/announcements'
              icon={FiBell}
              title='Annonces'
            />
          </Grid>
          <Grid size={4}>
            <AdminCard
              href='/admin/users'
              icon={FiUsers}
              title='Utilisateurs'
            />
          </Grid>
          <Grid size={4}>
            <AdminCard
              href='/admin/articles'
              icon={FiFileText}
              title='Articles'
            />
          </Grid>
          <Grid size={4}>
            <AdminCard
              href='/admin/categories'
              icon={FiTag}
              title='Catégories'
            />
          </Grid>
          <Grid size={4}>
            <AdminCard href='/admin/games' icon={FiBox} title='Jeux' />
          </Grid>
          <Grid size={4}>
            <AdminCard
              href='/admin/platforms'
              icon={FiMonitor}
              title='Plateformes'
            />
          </Grid>
          <Grid size={4}>
            <AdminCard
              href='/admin/companies'
              icon={FiBriefcase}
              title='Entreprises'
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;
