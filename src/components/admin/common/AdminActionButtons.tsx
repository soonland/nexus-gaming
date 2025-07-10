'use client';

import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem as MuiMenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { FiEdit2, FiMoreVertical, FiTrash, FiEye } from 'react-icons/fi';
import type { IconType } from 'react-icons/lib';

export interface IActionMenuItem {
  label: string;
  icon: IconType;
  href?: string;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  tooltip?: string; // Tooltip alternatif pour les boutons désactivés
}

interface IAdminActionButtonsProps {
  actions: IActionMenuItem[];
  maxButtons?: number;
}

export const AdminActionButtons = ({
  actions,
  maxButtons = 2,
}: IAdminActionButtonsProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const showAsMenu = actions.length > maxButtons;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAction = (action: IActionMenuItem) => {
    handleMenuClose();
    action.onClick?.();
  };

  // Rendu avec menu pour 3+ actions
  if (showAsMenu) {
    return (
      <>
        <Tooltip title='Actions'>
          <IconButton
            size='small'
            sx={{
              'color': 'action.active',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={handleMenuOpen}
          >
            <FiMoreVertical />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          {actions.map((action, index) => {
            const k = `key-${index}`;
            if (action.href) {
              return (
                <Link
                  key={k}
                  href={action.href}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MuiMenuItem
                    disabled={action.disabled}
                    sx={{ color: action.color }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <action.icon />
                    </ListItemIcon>
                    {action.label}
                  </MuiMenuItem>
                </Link>
              );
            }

            return (
              <MuiMenuItem
                key={k}
                disabled={action.disabled}
                sx={{ color: action.color }}
                onClick={() => handleAction(action)}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <action.icon />
                </ListItemIcon>
                {action.label}
              </MuiMenuItem>
            );
          })}
        </Menu>
      </>
    );
  }

  // Rendu avec boutons pour 1-2 actions
  return (
    <Stack direction='row' spacing={1}>
      {actions.map((action, index) => {
        const ButtonWrapper = action.href ? Link : 'span';
        const k = `key-${index}`;
        return (
          <Tooltip
            key={k}
            title={
              action.disabled && action.tooltip ? action.tooltip : action.label
            }
          >
            <IconButton
              component={ButtonWrapper}
              disabled={action.disabled}
              href={action.href}
              size='small'
              sx={{
                'color': action.color || 'primary.main',
                '&:hover': {
                  backgroundColor: `${action.color || 'primary'}.50`,
                },
              }}
              onClick={action.onClick}
            >
              <action.icon />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

// Actions prédéfinies
export const defaultActions = {
  view: (href: string): IActionMenuItem => ({
    label: 'Voir',
    icon: FiEye,
    href,
    color: 'info.main',
  }),
  edit: (href: string, disabled?: boolean): IActionMenuItem => ({
    label: 'Modifier',
    icon: FiEdit2,
    href,
    color: 'primary.main',
    disabled,
  }),
  delete: (onClick: () => void, disabled?: boolean): IActionMenuItem => ({
    label: 'Supprimer',
    icon: FiTrash,
    onClick,
    color: 'error.main',
    disabled,
  }),
};
