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

export type StatusValue = 'all' | ArticleStatus | 'active' | 'inactive';

export interface IStatusOption<T extends StatusValue = StatusValue> {
  value: T;
  label: string;
}

interface IAdminFiltersProps<T extends StatusValue = StatusValue> {
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  extra?: React.ReactNode;
  onStatusChange?: (status: T) => void;
  showStatusFilter?: boolean;
  selectedStatus?: T;
  statusOptions?: IStatusOption<T>[];
}

export const AdminFilters = <T extends StatusValue = StatusValue>({
  onSearch,
  searchPlaceholder = 'Rechercher...',
  extra,
  onStatusChange,
  showStatusFilter,
  selectedStatus = 'all' as T,
  statusOptions = [],
}: IAdminFiltersProps<T>) => {
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
          onChange={e => onStatusChange(e.target.value as T)}
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
