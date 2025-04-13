'use client';

import {
  Avatar,
  AvatarBadge,
  Box,
  Text,
  VStack,
  Icon,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useRef, useState } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';

import { uploadImage } from '@/lib/upload';

interface IAvatarUploadProps {
  currentAvatarUrl?: string | null;
  username: string;
  onUpload: (url: string) => void;
  className?: string;
}

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

export const AvatarUpload = ({
  currentAvatarUrl,
  username,
  onUpload,
  className = '',
}: IAvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // 5MB en octets
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Format non supporté',
        description: 'Veuillez sélectionner une image JPG ou PNG',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximum est de 5MB',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setIsUploading(true);
      setIsSuccess(false);
      const result = await uploadImage(file, 'avatars');
      setPreviewUrl(result.secure_url);
      onUpload(result.secure_url);
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de téléverser l'image",
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <Box className={className}>
      <VStack align='center' spacing={4}>
        <Box
          cursor='pointer'
          p={6}
          position='relative'
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            setIsDragging(false);
            handleDrop(e);
          }}
        >
          <Avatar name={username} size='xl' src={previewUrl || undefined}>
            {(isUploading || isSuccess) && (
              <AvatarBadge
                bg={isUploading ? 'blue.500' : 'green.500'}
                borderColor='white'
                borderWidth={1}
                boxSize='0.8em'
              >
                {isUploading ? (
                  <Spinner
                    color='white'
                    size='xs'
                    speed='0.8s'
                    thickness='1.5px'
                  />
                ) : (
                  <Icon as={FiCheck} boxSize={2.5} color='white' />
                )}
              </AvatarBadge>
            )}
          </Avatar>
          <Box
            _hover={{ opacity: 1 }}
            alignItems='center'
            bg={isDragging ? 'blackAlpha.700' : 'blackAlpha.600'}
            borderColor={isDragging ? 'blue.400' : 'transparent'}
            borderRadius='full'
            borderStyle='dashed'
            borderWidth={3}
            boxShadow={isDragging ? 'lg' : 'none'}
            display='flex'
            flexDirection='column'
            gap={1}
            inset='-1.5rem'
            justifyContent='center'
            opacity={isDragging ? 1 : 0}
            position='absolute'
            transform={isDragging ? 'scale(1.05)' : 'scale(1)'}
            transition='all 0.2s'
          >
            <VStack align='center' spacing={1} width='100%'>
              <Icon
                as={FiCamera}
                boxSize={5}
                color='white'
                sx={
                  isDragging
                    ? {
                        animation: `${pulseAnimation} 1.5s infinite`,
                      }
                    : undefined
                }
              />
              <Text
                color='white'
                fontSize='xs'
                fontWeight='medium'
                opacity={isDragging ? 1 : 0}
                transform='translateY(2px)'
              >
                Déposez l'image ici
              </Text>
            </VStack>
          </Box>
        </Box>

        <VStack spacing={1}>
          <Text color='gray.500' fontSize='sm'>
            Cliquez sur l'avatar ou déposez une image
          </Text>
          <Text color='gray.400' fontSize='xs'>
            Format JPG ou PNG, max 5MB
          </Text>
        </VStack>

        <input
          ref={fileInputRef}
          accept='image/*'
          style={{ display: 'none' }}
          type='file'
          onChange={handleFileInput}
        />
      </VStack>
    </Box>
  );
};
