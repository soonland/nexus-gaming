'use client'

import { useAdminAnnouncement, AdminAnnouncement } from '@/hooks/useAdminAnnouncement'
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
} from '@chakra-ui/react'
import { AnnouncementType } from '@prisma/client'
import { FiList, FiInfo, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

const typeToAlertProps = {
  [AnnouncementType.INFO]: {
    colorScheme: 'blue',
    status: 'info',
    label: 'Info',
    accent: 'blue.400',
    icon: FiInfo
  },
  [AnnouncementType.ATTENTION]: {
    colorScheme: 'orange',
    status: 'warning',
    label: 'Attention',
    accent: 'orange.400',
    icon: FiAlertCircle
  },
  [AnnouncementType.URGENT]: {
    colorScheme: 'red',
    status: 'error',
    label: 'Urgent',
    accent: 'red.400',
    icon: FiAlertTriangle
  },
} as const

function AnnouncementSummary({ announcements }: { announcements: AdminAnnouncement[] }) {
  const counts = Object.values(AnnouncementType).reduce((acc, type) => ({
    ...acc,
    [type]: announcements.filter(a => a.type === type).length
  }), {} as Record<AnnouncementType, number>)

  return (
    <HStack spacing={4}>
      {(Object.entries(counts) as [AnnouncementType, number][]).map(([type, count]) => (
        count > 0 && (
          <Badge 
            key={type}
            variant="solid"
            bg={typeToAlertProps[type].accent}
            color="white"
            p="1"
            fontWeight="medium"
          >
            {count} {typeToAlertProps[type].label}
          </Badge>
        )
      ))}
    </HStack>
  )
}

export function AdminAnnouncementBanner() {
  // Hooks
  const { announcements = [] } = useAdminAnnouncement()
  const { isLoading } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Theme values
  const modalBg = useColorModeValue('white', 'gray.800')
  const modalColor = useColorModeValue('inherit', 'white')
  const alertBg = useColorModeValue('white', 'gray.800')
  const alertHoverBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  if (isLoading) {
    return null
  }

  // Ne montrer que les annonces actives
  const activeAnnouncements = announcements.filter(a => a.isActive)
  if (!activeAnnouncements.length) {
    return null
  }

  return (
    <>
      <Container maxW="container.xl" mt={6}>
        <Box
          height="40px"
          bg="blue.500"
          color="white"
          mb={2}
          borderRadius="lg"
          overflow="hidden"
        >
          <Flex
            height="100%"
            px={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <AnnouncementSummary announcements={activeAnnouncements} />
            <Button
              size="sm"
              variant="ghost"
              color="white"
              leftIcon={<FiList />}
              onClick={onOpen}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Voir les annonces
            </Button>
          </Flex>
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent
          bg={modalBg}
          color={modalColor}
          boxShadow="xl"
        >
          <ModalHeader>Annonces actives</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <VStack spacing={0} width="100%">
              {activeAnnouncements.map(announcement => (
                <Alert
                  key={announcement.id}
                  variant="left-accent"
                  status={typeToAlertProps[announcement.type].status}
                  borderLeftColor={typeToAlertProps[announcement.type].accent}
                  bg={alertBg}
                  transition="background-color 0.2s"
                  _hover={{ bg: alertHoverBg }}
                  p={6}
                >
                  <Box 
                    fontSize="xl" 
                    color={typeToAlertProps[announcement.type].accent}
                    mr={4}
                    display="flex"
                    alignItems="flex-start"
                    mt={0.5}
                  >
                    <Icon as={typeToAlertProps[announcement.type].icon} />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="md" fontWeight="medium">
                      {announcement.message}
                    </Text>
                    <Text 
                      fontSize="sm" 
                      color={textColor}
                      mt={2}
                    >
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
  )
}
