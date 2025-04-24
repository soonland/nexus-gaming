import { Container, Typography } from '@mui/material';

import { BroadcastForm } from '../_components/BroadcastForm';

const BroadcastPage = () => {
  return (
    <Container maxWidth='sm' sx={{ py: 4 }}>
      <Typography gutterBottom variant='h5'>
        Envoyer une notification système
      </Typography>
      <BroadcastForm />
    </Container>
  );
};

export default BroadcastPage;
