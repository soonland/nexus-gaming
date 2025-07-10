'use client';

import { Box, Button } from '@mui/material';
import Link from 'next/link';

// Define the structure for a single action button
export interface IActionButton {
  label: string;
  icon: React.ElementType; // Use React.ElementType for the icon component
  href?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | 'inherit';
  onClick?: () => void;
  disabled?: boolean;
}

interface IAdminActionsProps {
  actions: IActionButton[]; // Array of actions
}

export const AdminActions = ({ actions }: IAdminActionsProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {actions.map((action, index) => (
        <Button
          key={index} // Using index as key, consider a more stable key if possible
          color={action.color}
          component={Link}
          disabled={action.disabled}
          href={action.href}
          startIcon={<action.icon />}
          variant={action.variant || 'contained'} // Default to 'contained'
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};
