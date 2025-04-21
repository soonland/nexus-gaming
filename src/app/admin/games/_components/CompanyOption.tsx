'use client';

import { Stack } from '@mui/material';
import { FiPlus } from 'react-icons/fi';

import type { ICompanyData } from '@/types/api';

interface ICompanyOptionProps {
  className?: string;
  option: ICompanyData;
  role: 'developer' | 'publisher';
}

export const CompanyOption = ({
  option,
  role,
  ...props
}: ICompanyOptionProps) => {
  const { className, ...liProps } = props;

  if (option.id === 'create-new') {
    return (
      <li className={className} {...liProps}>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiPlus />
          <span>
            Créer un {role === 'developer' ? 'développeur' : 'éditeur'}
          </span>
        </Stack>
      </li>
    );
  }

  return (
    <li className={className} {...liProps}>
      {option.name}
    </li>
  );
};
