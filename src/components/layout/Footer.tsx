import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  alpha,
  List,
  ListItem,
} from '@mui/material';
import { FaDiscord } from 'react-icons/fa';
import { FiGithub, FiTwitter } from 'react-icons/fi';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component='footer'
      sx={{
        mt: 'auto',
        py: 3,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.3)
            : alpha(theme.palette.background.paper, 0.03),
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          px: { xs: 2, sm: 2, md: 3 },
          width: '100%',
          maxWidth: theme => theme.breakpoints.values.lg,
        }}
      >
        <Grid container spacing={3}>
          {/* Logo and Description */}
          <Grid container size={{ xs: 12, md: 4 }}>
            <List sx={{ p: 0, width: '100%' }}>
              <ListItem sx={{ px: 0, pb: 1.5 }}>
                <Typography sx={{ letterSpacing: -0.01 }} variant='h6'>
                  Nexus Gaming
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/contact' underline='hover'>
                  Contactez-nous
                </Link>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/privacy' underline='hover'>
                  Politique de confidentialité
                </Link>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/terms' underline='hover'>
                  Conditions d&apos;utilisation
                </Link>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/legal' underline='hover'>
                  Mentions légales
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Quick Links */}
          <Grid container size={{ xs: 12, md: 4 }}>
            <List sx={{ p: 0, width: '100%' }}>
              <ListItem sx={{ px: 0, pb: 2 }}>
                <Typography
                  component='h2'
                  sx={{ letterSpacing: -0.01 }}
                  variant='h6'
                >
                  Liens Rapides
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/games' underline='hover'>
                  Jeux
                </Link>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/articles' underline='hover'>
                  Articles
                </Link>
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.75 }}>
                <Link color='text.secondary' href='/profile' underline='hover'>
                  Profil
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Social Links */}
          <Grid container size={{ xs: 12, md: 4 }}>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0, pb: 2 }}>
                <Typography
                  component='h2'
                  sx={{ letterSpacing: -0.01 }}
                  variant='h6'
                >
                  Suivez-nous
                </Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link
                    href='https://github.com'
                    rel='noopener'
                    sx={{
                      'color': 'text.secondary',
                      'transition': 'color 0.3s ease',
                      '&:hover': { color: 'primary.main' },
                    }}
                    target='_blank'
                  >
                    <FiGithub size={24} />
                  </Link>
                  <Link
                    href='https://twitter.com'
                    rel='noopener'
                    sx={{
                      'color': 'text.secondary',
                      'transition': 'color 0.3s ease',
                      '&:hover': { color: 'primary.main' },
                    }}
                    target='_blank'
                  >
                    <FiTwitter size={24} />
                  </Link>
                  <Link
                    href='https://discord.com'
                    rel='noopener'
                    sx={{
                      'color': 'text.secondary',
                      'transition': 'color 0.3s ease',
                      '&:hover': { color: 'primary.main' },
                    }}
                    target='_blank'
                  >
                    <FaDiscord size={24} />
                  </Link>
                </Box>
              </ListItem>
            </List>
          </Grid>

          {/* Copyright */}
          <Grid container size={12}>
            <Typography
              align='center'
              color='text.secondary'
              sx={{
                pt: 1.5,
                mt: 1.5,
                borderTop: 1,
                borderColor: 'divider',
                width: '100%',
              }}
              variant='body2'
            >
              © {currentYear} Nexus Gaming. Tous droits réservés.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
