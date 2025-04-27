'use client';

import { Box, Container, Paper, Typography } from '@mui/material';

const PrivacyPage = () => {
  return (
    <Container maxWidth='md'>
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography gutterBottom component='h1' variant='h4'>
            Politique de Confidentialité
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            1. Collecte des Données
          </Typography>
          <Typography paragraph variant='body1'>
            Nous collectons uniquement les données nécessaires au fonctionnement
            de nos services, incluant : votre adresse email, votre nom
            d&apos;utilisateur et vos préférences de jeux.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            2. Utilisation des Données
          </Typography>
          <Typography paragraph variant='body1'>
            Vos données sont utilisées pour personnaliser votre expérience,
            gérer votre compte et vous tenir informé des dernières actualités
            gaming.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            3. Protection des Données
          </Typography>
          <Typography paragraph variant='body1'>
            Nous mettons en œuvre des mesures de sécurité appropriées pour
            protéger vos données personnelles contre tout accès, modification,
            divulgation ou destruction non autorisée.
          </Typography>

          <Typography gutterBottom component='h2' sx={{ mt: 4 }} variant='h6'>
            4. Vos Droits
          </Typography>
          <Typography paragraph variant='body1'>
            Vous disposez d&apos;un droit d&apos;accès, de rectification et de
            suppression de vos données. Vous pouvez exercer ces droits en nous
            contactant via notre page de contact.
          </Typography>

          <Typography sx={{ mt: 4, color: 'text.secondary' }} variant='body2'>
            Dernière mise à jour : Avril 2025
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default PrivacyPage;
