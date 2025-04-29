'use client';

import { Box, Container, Paper, Typography } from '@mui/material';

const ContactPage = () => {
  return (
    <Container maxWidth='md'>
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography gutterBottom component='h1' variant='h4'>
            Contactez-nous
          </Typography>
          <Typography paragraph variant='body1'>
            Vous pouvez nous contacter pour toute question, suggestion ou
            demande d&apos;assistance.
          </Typography>
          <Typography paragraph variant='body1'>
            Email : contact@nexus-gaming.com
          </Typography>
          <Typography variant='body1'>
            Nous nous efforçons de répondre à toutes les demandes dans un délai
            de 48 heures ouvrables.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ContactPage;
