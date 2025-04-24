'use client';

import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useEffect, useState } from 'react';

interface INotifierContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const NotifierContext = createContext<INotifierContextValue | null>(null);

interface INotifierProviderProps {
  children: React.ReactNode;
}

export const NotifierProvider = ({ children }: INotifierProviderProps) => {
  const [notifications, setNotifications] = useState<
    Array<{
      message: string;
      severity: 'success' | 'error';
      id: number;
    }>
  >([]);
  const [currentNotification, setCurrentNotification] = useState<{
    message: string;
    severity: 'success' | 'error';
    id: number;
  } | null>(null);

  const showNotification = (message: string, severity: 'success' | 'error') => {
    const newNotification = {
      message,
      severity,
      id: Date.now(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');

  // Process notifications queue
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      const [next, ...rest] = notifications;
      setCurrentNotification(next);
      setNotifications(rest);
    }
  }, [notifications, currentNotification]);

  const handleClose = () => {
    setCurrentNotification(null);
  };

  return (
    <NotifierContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Snackbar
        key={currentNotification?.id}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        open={!!currentNotification}
        onClose={handleClose}
      >
        <Alert
          severity={currentNotification?.severity || 'success'}
          sx={{
            bgcolor: 'background.paper',
            transition: 'background-color 0.3s',
          }}
          onClose={handleClose}
        >
          {currentNotification?.message}
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
