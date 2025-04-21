'use client';

import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useState } from 'react';

interface INotifierContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const NotifierContext = createContext<INotifierContextValue | null>(null);

interface INotifierProviderProps {
  children: React.ReactNode;
}

export const NotifierProvider = ({ children }: INotifierProviderProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');

  const handleClose = () => setOpen(false);

  return (
    <NotifierContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        open={open}
        onClose={handleClose}
      >
        <Alert severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </NotifierContext.Provider>
  );
};

export const useNotifier = () => {
  const context = useContext(NotifierContext);
  if (!context) {
    throw new Error('useNotifier must be used within a NotifierProvider');
  }
  return context;
};
