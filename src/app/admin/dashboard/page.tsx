'use client';

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import {
  FiUsers,
  FiFileText,
  FiBox,
  FiTag,
  FiMonitor,
  FiBriefcase,
  FiBell,
} from 'react-icons/fi';

import { AnnouncementPanel } from '@/app/admin/announcements/_components/AnnouncementPanel';
import { AnimatedCounter, IconAnimation } from '@/components/common';
import { usePendingArticlesCount } from '@/hooks/admin/usePendingArticlesCount';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import { useGames } from '@/hooks/useGames';
import {
  canManageAnnouncements,
  canReviewArticles,
  hasSufficientRole,
} from '@/lib/permissions';

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
          <IconAnimation>
            <Icon size={24} />
          </IconAnimation>
        </Box>
        <Typography color='text.primary' variant='h6'>
          {title}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { announcements = [] } = useAnnouncements();
  const { articles: articlesData } = useArticles();
  const { games: gamesData } = useGames();
  const { user } = useAuth();
  const { count: pendingCount } = usePendingArticlesCount();
  const canManage = user ? canManageAnnouncements(user.role) : false;

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box mb={6}>
        <AnnouncementPanel announcements={announcements} />
      </Box>

      {/* Articles en attente */}
      {canReviewArticles(user?.role) && (
        <Box mb={6}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent>
              <Stack alignItems='center' direction='row' spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <IconAnimation>
                    <FiFileText size={24} />
                  </IconAnimation>
                </Box>
                <Box>
                  <Typography
                    gutterBottom
                    color='primary.contrastText'
                    variant='h6'
                  >
                    Articles en attente d'approbation
                  </Typography>
                  <Typography color='primary.contrastText' variant='h3'>
                    <AnimatedCounter end={pendingCount} />
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Navigation Administrative */}
      <Box mb={6}>
        <Typography gutterBottom color='text.primary' variant='h5'>
          Navigation Administrative
        </Typography>

        {/* Accès EDITOR */}
        {/* Gestion du contenu */}
        <Box mb={4}>
          <Typography color='text.secondary' sx={{ mb: 2 }} variant='subtitle1'>
            Gestion du Contenu
          </Typography>
          <Grid container spacing={3}>
            <Grid size={4}>
              <AdminCard
                href='/admin/articles'
                icon={FiFileText}
                title='Articles'
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
            {hasSufficientRole(user?.role, 'SENIOR_EDITOR') && (
              <Grid size={4}>
                <AdminCard
                  href='/admin/categories'
                  icon={FiTag}
                  title='Catégories'
                />
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Communication */}
        {(hasSufficientRole(user?.role, 'SENIOR_EDITOR') ||
          hasSufficientRole(user?.role, 'ADMIN')) && (
          <Box mb={4}>
            <Typography
              color='text.secondary'
              sx={{ mb: 2 }}
              variant='subtitle1'
            >
              Communication
            </Typography>
            <Grid container spacing={3}>
              {hasSufficientRole(user?.role, 'SENIOR_EDITOR') && (
                <Grid size={4}>
                  <AdminCard
                    href='/admin/announcements'
                    icon={FiBell}
                    title='Annonces'
                  />
                </Grid>
              )}
              {hasSufficientRole(user?.role, 'ADMIN') && (
                <Grid size={4}>
                  <AdminCard
                    href='/admin/notifications/broadcast'
                    icon={FiBell}
                    title='Notifications'
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Système */}
        {hasSufficientRole(user?.role, 'SENIOR_EDITOR') && (
          <Box>
            <Typography
              color='text.secondary'
              sx={{ mb: 2 }}
              variant='subtitle1'
            >
              Système
            </Typography>
            <Grid container spacing={3}>
              <Grid size={4}>
                <AdminCard
                  href='/admin/users'
                  icon={FiUsers}
                  title='Utilisateurs'
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Statistiques */}
      {canManage && (
        <Box mb={6}>
          <Typography gutterBottom color='text.primary' variant='h5'>
            Statistiques
          </Typography>
          <Grid container spacing={3}>
            <Grid size={4}>
              <Card>
                <CardContent>
                  <Typography gutterBottom color='text.primary' variant='h6'>
                    Articles
                  </Typography>
                  <Typography color='text.primary' variant='h3'>
                    <AnimatedCounter end={articlesData?.length || 0} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card>
                <CardContent>
                  <Typography gutterBottom color='text.primary' variant='h6'>
                    Jeux
                  </Typography>
                  <Typography color='text.primary' variant='h3'>
                    <AnimatedCounter end={gamesData?.length || 0} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;
