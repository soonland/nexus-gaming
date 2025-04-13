import { Box, Container } from '@chakra-ui/react';

import { NavbarContent } from './NavbarContent';

export const Navbar = () => {
  return (
    <Box as='nav' position='sticky' py={4} top={0} zIndex={100}>
      <Container maxW='container.xl'>
        <NavbarContent />
      </Container>
    </Box>
  );
};
