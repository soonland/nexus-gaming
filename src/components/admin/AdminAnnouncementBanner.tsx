'use client'

import { useAdminAnnouncement, AdminAnnouncement } from '@/hooks/useAdminAnnouncement'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  CloseButton,
  Collapse,
  Container,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AnnouncementType } from '@prisma/client'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

const typeToAlertProps = {
  [AnnouncementType.INFO]: {
    status: 'info',
    colorScheme: 'blue',
    label: 'Info',
    accent: 'blue.400'
  },
  [AnnouncementType.ATTENTION]: {
    status: 'warning',
    colorScheme: 'orange',
    label: 'Attention',
    accent: 'orange.400'
  },
  [AnnouncementType.URGENT]: {
    status: 'error',
    colorScheme: 'red',
    label: 'Urgent',
    accent: 'red.400'
  },
} as const

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.05)', opacity: 0.9 }}
          >
            {count} {typeToAlertProps[type].label}
          </Badge>
        )
      ))}
    </HStack>
  )
}

export function AdminAnnouncementBanner() {
  const { announcements = [], updateAnnouncement } = useAdminAnnouncement()
  const { isLoading } = useAuth()
  const [isExpanded, setIsExpanded] = useState(true)

  if (isLoading) {
    return null
  }

  if (!announcements.length) {
    return null
  }

  const handleClose = (id: string) => {
    updateAnnouncement.mutate({ id, isActive: false })
  }

  const headerIconColor = 'white'

  return (
    <Container maxW="container.xl">
      <Box 
        borderRadius="lg" 
        bg="white"
        mb={4}
        borderWidth="1px"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Flex
          p={4}
          onClick={() => setIsExpanded(!isExpanded)}
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          bg="blue.500"
          color="white"
          transition="background-color 0.2s"
          _hover={{ bg: 'blue.600' }}
          borderBottomWidth={isExpanded ? "1px" : "0"}
          borderBottomColor="blue.400"
        >
          <AnnouncementSummary announcements={announcements} />
          <Icon 
            as={isExpanded ? FiChevronUp : FiChevronDown}
            color={headerIconColor}
          />
        </Flex>

        <Collapse in={isExpanded}>
          <VStack spacing={2} p={4}>
            {announcements.map(announcement => (
              <Alert
                key={announcement.id}
                status={typeToAlertProps[announcement.type].status as any}
                width="100%"
                variant="left-accent"
                bg="whiteAlpha.900"
                color="gray.700"
                borderRadius="md"
                boxShadow="sm"
                borderStartWidth="3px"
                borderStartColor={typeToAlertProps[announcement.type].accent}
                _hover={{ bg: 'gray.50' }}
              >
                <AlertIcon color={typeToAlertProps[announcement.type].accent} />
                <Box flex="1">
                  <AlertTitle>{announcement.message}</AlertTitle>
                  <Text fontSize="sm" color="gray.600">
                    Par {announcement.createdBy.username}
                    {announcement.expiresAt && (
                      <> • Expire le {formatDate(announcement.expiresAt)}</>
                    )}
                  </Text>
                </Box>
                <CloseButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose(announcement.id)
                  }}
                  transition="all 0.2s"
                  _hover={{ bg: 'blackAlpha.100' }}
                />
              </Alert>
            ))}
          </VStack>
        </Collapse>
      </Box>
    </Container>
  )
}
