'use client';

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { FiAlertCircle } from 'react-icons/fi';

interface IFormErrorSummaryProps {
  errors: {
    field: string;
    message: string;
  }[];
}

export const FormErrorSummary = ({ errors }: IFormErrorSummaryProps) => {
  if (errors.length === 0) return null;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: 'error.lightest',
        border: 1,
        borderColor: 'error.light',
      }}
    >
      <Typography gutterBottom color='error' variant='subtitle2'>
        Veuillez corriger les erreurs suivantes :
      </Typography>
      <List dense>
        {errors.map(({ field, message }, index) => (
          <ListItem key={index}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FiAlertCircle color='error' />
            </ListItemIcon>
            <ListItemText
              primary={`${field} : ${message}`}
              primaryTypographyProps={{ color: 'error' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
