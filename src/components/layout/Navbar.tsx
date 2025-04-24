import { Box, Container } from '@mui/material';

import { NavbarContent } from './NavbarContent';

export const Navbar = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 100,
        transition: 'background-color 0.3s',
      }}
    >
      <Container maxWidth='lg'>
        <NavbarContent />
      </Container>
    </Box>
  );
};
