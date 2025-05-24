'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface IAdminDeactivateDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  message: string;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminDeactivateDialog = ({
  isOpen,
  isLoading,
  message,
  title,
  onClose,
  onConfirm,
}: IAdminDeactivateDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={() => !isLoading && onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color='inherit'
          disabled={isLoading}
          variant='outlined'
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          autoFocus
          color='error'
          disabled={isLoading}
          variant='contained'
          onClick={onConfirm}
        >
          Désactiver
        </Button>
      </DialogActions>
    </Dialog>
  );
};
