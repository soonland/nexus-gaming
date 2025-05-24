'use client';

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Link as MuiLink,
  Stack,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { SocialPlatform } from '@prisma/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import NextLink from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { FaXbox } from 'react-icons/fa';
import { FiExternalLink, FiTwitch, FiTwitter, FiYoutube } from 'react-icons/fi';
import {
  SiPlaystation,
  SiSteam,
  SiNintendoswitch,
  SiEpicgames,
  SiBattledotnet,
  SiInstagram,
  SiTiktok,
} from 'react-icons/si';

import { usePublicUser } from '@/hooks/usePublicUser';

const SOCIAL_ICONS: Record<SocialPlatform, React.ReactNode> = {
  PSN: <SiPlaystation />,
  XBOX: <FaXbox />,
  STEAM: <SiSteam />,
  NINTENDO: <SiNintendoswitch />,
  EPIC: <SiEpicgames />,
  BATTLENET: <SiBattledotnet />,
  TWITCH: <FiTwitch />,
  TWITTER: <FiTwitter />,
  INSTAGRAM: <SiInstagram />,
  TIKTOK: <SiTiktok />,
  YOUTUBE: <FiYoutube />,
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  MODERATOR: 'Modérateur',
  USER: 'Membre',
};

const ROLE_COLORS: Record<string, 'error' | 'warning' | 'default'> = {
  ADMIN: 'error',
  MODERATOR: 'warning',
  USER: 'default',
};

const UserProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  const { data: user, isError } = usePublicUser(username);

  if (isError) {
    return notFound();
  }

  if (!user) {
    return null;
  }

  const socialProfiles = user.socialProfiles.reduce<
    Partial<Record<SocialPlatform, string>>
  >((acc, profile) => {
    acc[profile.platform] = profile.url;
    return acc;
  }, {});

  const articleCount = user.articles.length;
  const memberSince = format(new Date(user.createdAt), 'MMMM yyyy', {
    locale: fr,
  });

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack alignItems='center' direction='row' mb={3} spacing={3}>
                <Avatar
                  src={user.avatarUrl || undefined}
                  sx={{ width: 120, height: 120 }}
                />
                <Box>
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <Typography variant='h4'>{user.username}</Typography>
                    <Chip
                      color={ROLE_COLORS[user.role]}
                      label={ROLE_LABELS[user.role]}
                      size='small'
                    />
                  </Stack>
                  <Typography color='text.secondary' mt={1} variant='body2'>
                    Membre depuis {memberSince}
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}>
                  <Paper
                    sx={{
                      backgroundColor: 'background.default',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography color='primary' variant='h4'>
                      {articleCount}
                    </Typography>
                    <Typography color='text.secondary' variant='body2'>
                      Articles publiés
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper
                    sx={{
                      backgroundColor: 'background.default',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography color='primary' variant='h4'>
                      {Object.keys(socialProfiles).length}
                    </Typography>
                    <Typography color='text.secondary' variant='body2'>
                      Profils sociaux
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box>
                <MuiLink
                  component={NextLink}
                  href={`/articles?author=${user.username}`}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                    gap: 0.5,
                  }}
                  variant='body1'
                >
                  Voir tous les articles <FiExternalLink />
                </MuiLink>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {Object.entries(socialProfiles).length > 0 && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant='h6'>
                  Profils Sociaux
                </Typography>
                <Stack spacing={1.5}>
                  {Object.entries(socialProfiles).map(([platform, url]) => (
                    <MuiLink
                      key={platform}
                      href={url}
                      rel='noopener noreferrer'
                      sx={{
                        'alignItems': 'center',
                        'color': 'text.primary',
                        'display': 'flex',
                        'gap': 1,
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                      target='_blank'
                    >
                      {SOCIAL_ICONS[platform as SocialPlatform]}
                      <Typography variant='body2'>
                        {platform.charAt(0) + platform.slice(1).toLowerCase()}
                      </Typography>
                    </MuiLink>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default UserProfilePage;
