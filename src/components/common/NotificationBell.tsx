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

  const hasNotifications =
    passwordExpiration?.isExpiringSoon || passwordExpiration?.isExpired;

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
              bg='red.500'
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
                  {passwordExpiration?.isExpired
                    ? 'Votre mot de passe a expiré'
                    : `Votre mot de passe expire dans ${passwordExpiration?.daysUntilExpiration} jours`}
                </Text>
                <Text color={textColor} fontSize='sm'>
                  Pour votre sécurité, veuillez mettre à jour votre mot de
                  passe.
                </Text>
              </Box>
              <Button
                as={Link}
                colorScheme={passwordExpiration?.isExpired ? 'red' : 'blue'}
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
