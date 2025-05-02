'use client';

import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  debounce,
} from '@mui/material';
import type { ArticleStatus } from '@prisma/client';
import { useCallback } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';

const createDebouncedSearch = (callback?: (value: string) => void) =>
  debounce((value: string) => {
    callback?.(value);
  }, 300);

export interface IStatusOption {
  value: ArticleStatus | 'all';
  label: string;
}

interface IAdminFiltersProps {
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  extra?: React.ReactNode;
  onStatusChange?: (status: ArticleStatus | 'all') => void;
  showStatusFilter?: boolean;
  selectedStatus?: ArticleStatus | 'all';
  statusOptions?: IStatusOption[];
}

export const AdminFilters = ({
  onSearch,
  searchPlaceholder = 'Rechercher...',
  extra,
  onStatusChange,
  showStatusFilter,
  selectedStatus = 'all',
  statusOptions = [],
}: IAdminFiltersProps) => {
  const debouncedSearch = useCallback(
    (value: string) => {
      createDebouncedSearch(onSearch)(value);
    },
    [onSearch]
  );

  return (
    <Stack direction='row' spacing={2}>
      {onSearch && (
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder={searchPlaceholder}
          size='small'
          sx={{ minWidth: 300 }}
          onChange={e => debouncedSearch(e.target.value)}
        />
      )}
      {showStatusFilter && onStatusChange && (
        <Select
          size='small'
          sx={{ minWidth: 200 }}
          value={selectedStatus}
          onChange={e =>
            onStatusChange(e.target.value as ArticleStatus | 'all')
          }
        >
          {statusOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>{extra}</Box>
    </Stack>
  );
};
