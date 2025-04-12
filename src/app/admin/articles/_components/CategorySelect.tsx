'use client';

import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectProps {
  value?: string;
  onChange: (categoryId: string | undefined) => void;
}

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  return (
    <FormControl>
      <FormLabel>Catégorie</FormLabel>
      <Select
        isDisabled={isLoading}
        placeholder='Sélectionner une catégorie'
        value={value || ''}
        onChange={e => onChange(e.target.value || undefined)}
      >
        {categories?.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
