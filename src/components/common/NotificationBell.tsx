'use client';

import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiBell } from 'react-icons/fi';

import { usePasswordExpiration } from '@/hooks/usePasswordExpiration';

export const NotificationBell = () => {
  const passwordExpiration = usePasswordExpiration();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const warningLevelConfig = {
    expired: { color: 'red.500', text: 'Votre mot de passe a expiré' },
    urgent: { color: 'red.500', text: 'Expiration imminente' },
    warning: { color: 'orange.500', text: 'Expiration approche' },
    info: { color: 'blue.500', text: 'Pensez à changer votre mot de passe' },
    none: { color: undefined, text: undefined },
  };

  if (!passwordExpiration) {
    return null;
  }

  const hasNotifications = passwordExpiration.warningLevel !== 'none';

  return (
    <Popover placement='bottom-end'>
      <PopoverTrigger>
        <Box position='relative'>
          <IconButton
            aria-label='Notifications'
            icon={<FiBell size={20} />}
            position='relative'
            variant='ghost'
          />
          {hasNotifications && (
            <Box
              bg={warningLevelConfig[passwordExpiration.warningLevel].color}
              border='2px solid white'
              borderRadius='full'
              h='3'
              position='absolute'
              right='-1'
              top='-1'
              w='3'
            />
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width='300px'>
        <PopoverBody py={4}>
          {hasNotifications ? (
            <VStack align='stretch' spacing={4}>
              <Box>
                <Text fontSize='sm' fontWeight='medium'>
                  {warningLevelConfig[passwordExpiration.warningLevel].text}
                </Text>
                <Text color={textColor} fontSize='sm'>
                  {passwordExpiration.daysUntilExpiration > 0
                    ? `Il vous reste ${passwordExpiration.daysUntilExpiration} jours pour changer votre mot de passe.`
                    : 'Pour votre sécurité, veuillez mettre à jour votre mot de passe immédiatement.'}
                </Text>
              </Box>
              <Button
                as={Link}
                colorScheme={
                  passwordExpiration.warningLevel === 'expired' ||
                  passwordExpiration.warningLevel === 'urgent'
                    ? 'red'
                    : passwordExpiration.warningLevel === 'warning'
                      ? 'orange'
                      : 'blue'
                }
                href='/profile'
                size='sm'
              >
                Changer le mot de passe
              </Button>
            </VStack>
          ) : (
            <Text color='gray.500' fontSize='sm'>
              Aucune notification
            </Text>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
