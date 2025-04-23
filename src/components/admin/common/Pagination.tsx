'use client';

import type { SelectChangeEvent } from '@mui/material';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import {
  FiChevronsLeft as PreviousIcon,
  FiChevronsRight as NextIcon,
} from 'react-icons/fi';

interface IPaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination = ({
  currentPage,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: IPaginationProps) => {
  return (
    <Stack
      alignItems='center'
      direction='row'
      justifyContent='flex-end'
      spacing={2}
      sx={{ my: 1 }}
    >
      <Stack alignItems='center' direction='row' spacing={1}>
        <Typography color='text.secondary' variant='body2'>
          Afficher
        </Typography>
        <Select
          size='small'
          sx={{
            '.MuiSelect-select': {
              py: 0.5,
              px: 1.5,
            },
          }}
          value={pageSize.toString()}
          onChange={(e: SelectChangeEvent) => {
            onPageSizeChange?.(Number(e.target.value));
          }}
        >
          <MenuItem value='5'>5</MenuItem>
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='25'>25</MenuItem>
        </Select>
      </Stack>
      <IconButton
        disabled={currentPage === 1}
        size='small'
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <PreviousIcon />
      </IconButton>
      <Typography color='text.secondary' variant='body2'>
        {Math.min((currentPage - 1) * pageSize + 1, total)} à{' '}
        {Math.min(currentPage * pageSize, total)} sur {total} enregistrements
      </Typography>
      <IconButton
        disabled={currentPage >= totalPages}
        size='small'
        onClick={() => onPageChange(currentPage + 1)}
      >
        <NextIcon />
      </IconButton>
    </Stack>
  );
};
