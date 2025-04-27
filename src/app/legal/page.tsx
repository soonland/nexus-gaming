'use client';

import { Box, Container, Paper, Typography } from '@mui/material';

const LegalPage = () => {
  return (
    <Container maxWidth='md'>
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography gutterBottom component='h1' variant='h4'>
            Mentions Légales
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            1. Informations sur la Société
          </Typography>
          <Typography paragraph variant='body1'>
            Nexus Gaming est une plateforme d&apos;actualités de jeux vidéo.
            Siège social : [Adresse] SIRET : [Numéro SIRET]
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            2. Hébergement
          </Typography>
          <Typography paragraph variant='body1'>
            Ce site est hébergé par [Nom de l&apos;hébergeur] Adresse : [Adresse
            de l&apos;hébergeur] Contact : [Contact de l&apos;hébergeur]
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            3. Propriété Intellectuelle
          </Typography>
          <Typography paragraph variant='body1'>
            L&apos;ensemble des éléments présents sur ce site (textes, images,
            logos, etc.) sont protégés par le droit d&apos;auteur. Toute
            reproduction sans autorisation préalable est interdite.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            4. Données Personnelles
          </Typography>
          <Typography paragraph variant='body1'>
            Conformément à la loi Informatique et Libertés et au RGPD, vous
            disposez d&apos;un droit d&apos;accès, de rectification et de
            suppression des données vous concernant.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            5. Cookies
          </Typography>
          <Typography paragraph variant='body1'>
            Ce site utilise des cookies pour améliorer l&apos;expérience
            utilisateur. En naviguant sur ce site, vous acceptez leur
            utilisation conformément à notre politique de confidentialité.
          </Typography>

          <Typography sx={{ mt: 4, color: 'text.secondary' }} variant='body2'>
            Dernière mise à jour : Avril 2025
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LegalPage;
