'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import { Box, InputAdornment, Stack, TextField, debounce } from '@mui/material';
import { useCallback } from 'react';

const createDebouncedSearch = (callback?: (value: string) => void) =>
  debounce((value: string) => {
    callback?.(value);
  }, 300);

interface IAdminFiltersProps {
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  extra?: React.ReactNode;
}

export const AdminFilters = ({
  onSearch,
  searchPlaceholder = 'Rechercher...',
  extra,
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
      <Box sx={{ display: 'flex', gap: 2 }}>{extra}</Box>
    </Stack>
  );
};
