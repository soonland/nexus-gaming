'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Text,
  VStack,
  Icon,
  IconButton,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useRef, useState } from 'react';
import { FiCamera, FiCheck, FiTrash2 } from 'react-icons/fi';

import { uploadImage } from '@/lib/upload';

export const getPublicIdFromUrl = (url: string) => {
  const matches = url.match(/\/v\d+\/(.+?)\.\w+$/);
  return matches ? matches[1] : null;
};

interface IAvatarUploadProps {
  currentAvatarUrl?: string | null;
  username: string;
  onUpload: (url: string | null) => void;
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
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);
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

      // Si on a un ancien avatar, on le supprime
      if (currentAvatarUrl) {
        const oldPublicId = getPublicIdFromUrl(currentAvatarUrl);
        if (oldPublicId) {
          // On ne veut pas attendre la suppression
          fetch(
            `/api/upload/delete?public_id=${encodeURIComponent(oldPublicId)}`,
            {
              method: 'DELETE',
            }
          ).catch(console.error);
        }
      }

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

  const handleDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await fetch(
        `/api/upload/delete?public_id=${encodeURIComponent(pendingDeleteId)}`,
        {
          method: 'DELETE',
        }
      );
      setPreviewUrl(null);
      onUpload(null);
      // Le toast de succès sera géré par le parent
    } catch (error) {
      toast({
        title: 'Erreur lors de la suppression',
        status: 'error',
        duration: 3000,
      });
      console.error('Failed to delete avatar:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <Box className={className}>
      <VStack align='center' spacing={4}>
        <Box
          cursor='pointer'
          p={3}
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
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Overlay sur hover */}
          <Box
            alignItems='center'
            bg='blackAlpha.600'
            borderRadius='full'
            display='flex'
            flexDirection='column'
            gap={1}
            inset='-0.75rem'
            justifyContent='center'
            opacity={isHovering && !isDragging ? 1 : 0}
            position='absolute'
            transition='all 0.2s'
            zIndex={1}
          >
            <VStack spacing={1}>
              <Icon as={FiCamera} boxSize={5} color='white' />
              <Text color='white' fontSize='xs'>
                Changer l&apos;avatar
              </Text>
            </VStack>
          </Box>

          {/* Zone de drop */}
          {isDragging && (
            <Box
              alignItems='center'
              bg='blackAlpha.700'
              borderColor='blue.400'
              borderRadius='full'
              borderStyle='dashed'
              borderWidth={3}
              boxShadow='lg'
              display='flex'
              flexDirection='column'
              gap={1}
              inset='-0.75rem'
              justifyContent='center'
              position='absolute'
              transform='scale(1.05)'
              transition='all 0.2s'
              zIndex={1}
            >
              <VStack align='center' spacing={1}>
                <Icon
                  as={FiCamera}
                  boxSize={5}
                  color='white'
                  sx={{
                    animation: `${pulseAnimation} 1.5s infinite`,
                  }}
                />
                <Text color='white' fontSize='xs'>
                  Déposez l&apos;image ici
                </Text>
              </VStack>
            </Box>
          )}

          {/* Avatar et badge de suppression */}
          <Box position='relative' zIndex={2}>
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
            {previewUrl && (
              <IconButton
                aria-label="Supprimer l'avatar"
                colorScheme='red'
                icon={<Icon as={FiTrash2} />}
                position='absolute'
                right='-2'
                size='sm'
                top='-2'
                zIndex={3}
                onClick={e => {
                  e.stopPropagation();
                  const publicId = getPublicIdFromUrl(previewUrl);

                  if (!publicId) return;
                  setPendingDeleteId(publicId);
                  setIsDeleteDialogOpen(true);
                }}
              />
            )}
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

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Supprimer l&apos;avatar
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer votre avatar ? Cette action est
              irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelDeleteRef}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button colorScheme='red' ml={3} onClick={handleDelete}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
