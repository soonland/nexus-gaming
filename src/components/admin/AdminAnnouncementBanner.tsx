'use client';

import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  VStack,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnnouncementType } from '@prisma/client';
import { FiList, FiInfo, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import type { AdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import { useAuth } from '@/hooks/useAuth';

const typeToAlertProps = {
  [AnnouncementType.INFO]: {
    colorScheme: 'blue',
    status: 'info',
    label: 'Info',
    accent: 'blue.400',
    icon: FiInfo,
  },
  [AnnouncementType.ATTENTION]: {
    colorScheme: 'orange',
    status: 'warning',
    label: 'Attention',
    accent: 'orange.400',
    icon: FiAlertCircle,
  },
  [AnnouncementType.URGENT]: {
    colorScheme: 'red',
    status: 'error',
    label: 'Urgent',
    accent: 'red.400',
    icon: FiAlertTriangle,
  },
} as const;

const AnnouncementSummary = ({
  announcements,
}: {
  announcements: AdminAnnouncement[];
}) => {
  const counts = Object.values(AnnouncementType).reduce(
    (acc, type) => ({
      ...acc,
      [type]: announcements.filter(a => a.type === type).length,
    }),
    {} as Record<AnnouncementType, number>
  );

  return (
    <HStack spacing={4}>
      {(Object.entries(counts) as [AnnouncementType, number][]).map(
        ([type, count]) =>
          count > 0 && (
            <Badge
              key={type}
              bg={typeToAlertProps[type].accent}
              color='white'
              fontWeight='medium'
              p='1'
              variant='solid'
            >
              {count} {typeToAlertProps[type].label}
            </Badge>
          )
      )}
    </HStack>
  );
};

export const AdminAnnouncementBanner = () => {
  // Hooks
  const { announcements = [] } = useAdminAnnouncement();
  const { isLoading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Theme values
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalColor = useColorModeValue('inherit', 'white');
  const alertBg = useColorModeValue('white', 'gray.800');
  const alertHoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  if (isLoading) {
    return null;
  }

  // Ne montrer que les annonces actives
  const activeAnnouncements = announcements.filter(a => a.isActive);
  if (!activeAnnouncements.length) {
    return null;
  }

  return (
    <>
      <Container maxW='container.xl' mt={6}>
        <Box
          bg='blue.500'
          borderRadius='lg'
          color='white'
          height='40px'
          mb={2}
          overflow='hidden'
        >
          <Flex
            alignItems='center'
            height='100%'
            justifyContent='space-between'
            px={4}
          >
            <AnnouncementSummary announcements={activeAnnouncements} />
            <Button
              _hover={{ bg: 'whiteAlpha.200' }}
              color='white'
              leftIcon={<FiList />}
              size='sm'
              variant='ghost'
              onClick={onOpen}
            >
              Voir les annonces
            </Button>
          </Flex>
        </Box>
      </Container>

      <Modal isOpen={isOpen} size='2xl' onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={modalBg} boxShadow='xl' color={modalColor}>
          <ModalHeader>Annonces actives</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <VStack spacing={0} width='100%'>
              {activeAnnouncements.map(announcement => (
                <Alert
                  key={announcement.id}
                  _hover={{ bg: alertHoverBg }}
                  bg={alertBg}
                  borderLeftColor={typeToAlertProps[announcement.type].accent}
                  p={6}
                  status={typeToAlertProps[announcement.type].status}
                  transition='background-color 0.2s'
                  variant='left-accent'
                >
                  <Box
                    alignItems='flex-start'
                    color={typeToAlertProps[announcement.type].accent}
                    display='flex'
                    fontSize='xl'
                    mr={4}
                    mt={0.5}
                  >
                    <Icon as={typeToAlertProps[announcement.type].icon} />
                  </Box>
                  <Box flex='1'>
                    <Text fontSize='md' fontWeight='medium'>
                      {announcement.message}
                    </Text>
                    <Text color={textColor} fontSize='sm' mt={2}>
                      Par {announcement.createdBy.username}
                    </Text>
                  </Box>
                </Alert>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
