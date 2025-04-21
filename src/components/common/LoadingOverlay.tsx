'use client';

import { Box, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ILoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: ILoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          transition={{ duration: 0.15 }}
        >
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
