'use client';

import { Box, Container, Paper, Typography } from '@mui/material';

const TermsPage = () => {
  return (
    <Container maxWidth='md'>
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography gutterBottom component='h1' variant='h4'>
            Conditions d&apos;Utilisation
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            1. Acceptation des Conditions
          </Typography>
          <Typography paragraph variant='body1'>
            En accédant à Nexus Gaming, vous acceptez d&apos;être lié par ces
            conditions d&apos;utilisation, toutes les lois et réglementations
            applicables.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            2. Utilisation du Service
          </Typography>
          <Typography paragraph variant='body1'>
            Vous vous engagez à ne pas utiliser le service pour des fins
            illégales ou interdites par ces conditions. Le service est destiné à
            un usage personnel et non commercial.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            3. Comptes Utilisateurs
          </Typography>
          <Typography paragraph variant='body1'>
            Vous êtes responsable du maintien de la confidentialité de votre
            compte et de votre mot de passe. Vous devez nous informer
            immédiatement de toute utilisation non autorisée.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            4. Propriété Intellectuelle
          </Typography>
          <Typography paragraph variant='body1'>
            Le contenu du site, incluant textes, graphiques, logos et images,
            est la propriété de Nexus Gaming et est protégé par les lois sur la
            propriété intellectuelle.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            5. Modification des Conditions
          </Typography>
          <Typography paragraph variant='body1'>
            Nous nous réservons le droit de modifier ces conditions à tout
            moment. Les modifications entrent en vigueur dès leur publication
            sur le site.
          </Typography>

          <Typography sx={{ mt: 4, color: 'text.secondary' }} variant='body2'>
            Dernière mise à jour : Avril 2025
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default TermsPage;
