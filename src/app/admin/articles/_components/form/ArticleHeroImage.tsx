'use client';

import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import { FiCamera } from 'react-icons/fi';

import { getCloudinaryUrl } from '@/lib/cloudinary/urls';

import type { IArticleHeroImageProps } from './types';

export const ArticleHeroImage = ({
  heroImage,
  isUploading,
  onImageChange,
}: IArticleHeroImageProps) => {
  return (
    <Box>
      <Typography gutterBottom sx={{ mb: 1 }} variant='body2'>
        Image à la une
      </Typography>
      <Box position='relative' sx={{ width: '100%', height: 200 }}>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {heroImage ? (
            <Tooltip title='Image à la une'>
              <Image
                fill
                alt='Hero image preview'
                src={getCloudinaryUrl(heroImage, { width: 800, quality: 80 })}
                style={{ objectFit: 'cover' }}
              />
            </Tooltip>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
              }}
            >
              <Typography color='text.secondary' variant='body2'>
                Aucune image sélectionnée
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isUploading ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            {isUploading && (
              <CircularProgress size={32} sx={{ color: 'white' }} />
            )}
          </Box>
          <IconButton
            aria-label="Changer l'image à la une"
            component='label'
            disabled={isUploading}
            sx={{
              'position': 'absolute',
              'right': 8,
              'bottom': 8,
              'bgcolor': 'background.paper',
              'boxShadow': 1,
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <input
              hidden
              accept='image/*'
              type='file'
              onChange={onImageChange}
            />
            <FiCamera />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
