'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface IAdminDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export const AdminDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = 'Confirmer la suppression',
  message = 'Êtes-vous sûr de vouloir supprimer cet élément ?',
}: IAdminDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
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
          color='error'
          disabled={isLoading}
          variant='contained'
          onClick={onConfirm}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
