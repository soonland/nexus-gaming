import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Input,
  VStack,
  Radio,
  RadioGroup,
  HStack,
} from '@chakra-ui/react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { GameFormData } from '@/types/game';

interface ReleaseDateSelectorProps {
  control: Control<GameFormData>;
  register: UseFormRegister<GameFormData>;
  errors: {
    releasePeriod?: {
      message?: string;
    };
  };
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const getCurrentYear = () => new Date().getFullYear();
const YEARS = Array.from({length: 5}, (_, i) => getCurrentYear() + i);

export const ReleaseDateSelector = ({
  control,
  errors,
}: ReleaseDateSelectorProps) => {
  return (
    <FormControl isInvalid={!!errors.releasePeriod}>
      <FormLabel>Date de sortie</FormLabel>
      <Controller
        name="releasePeriod"
        control={control}
        render={({ field: { onChange, value } }) => {
          const handleTypeChange = (newType: string) => {
            onChange({ type: newType, value: '' });
          };

          const handleDateChange = (newValue: string) => {
            onChange({ type: 'date', value: newValue });
          };

          const handleMonthChange = (newMonth: string) => {
            const year = value?.value?.split('-')[0] || getCurrentYear();
            const paddedMonth = newMonth.padStart(2, '0');
            onChange({ type: 'month', value: `${year}-${paddedMonth}` });
          };

          const handleYearChange = (newYear: string) => {
            const month = value?.value?.split('-')[1] || '01';
            onChange({ type: 'month', value: `${newYear}-${month}` });
          };

          const handleQuarterChange = (newQuarter: string) => {
             const year = value?.value?.split('-')[0] || getCurrentYear();
            onChange({ type: 'quarter', value: `${year}-${newQuarter}` });
          };

          const handleQuarterYearChange = (newYear: string) => {
            const quarter = value?.value?.split('-')[1] || 'Q1';
            onChange({ type: 'quarter', value: `${newYear}-${quarter}` });
          };

          return (
            <VStack align="stretch" spacing={4}>
              <RadioGroup
                onChange={handleTypeChange}
                value={value?.type || 'date'}
              >
                <HStack spacing={4}>
                  <Radio value="date">Date précise</Radio>
                  <Radio value="month">Mois</Radio>
                  <Radio value="quarter">Trimestre</Radio>
                </HStack>
              </RadioGroup>

              {value?.type === 'date' && (
                <Input
                  type="date"
                  onChange={(e) => handleDateChange(e.target.value)}
                  value={value.value}
                />
              )}

              {value?.type === 'month' && (
                <HStack>
                  <Select
                    placeholder="Année"
                    onChange={(e) => handleYearChange(e.target.value)}
                    value={value.value?.split('-')[0] || ''}
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Mois"
                    onChange={(e) => handleMonthChange(e.target.value)}
                    value={value.value?.split('-')[1] || ''}
                  >
                    {MONTHS.map((month, index) => (
                      <option key={month} value={(index + 1).toString().padStart(2, '0')}>
                        {month}
                      </option>
                    ))}
                  </Select>
                </HStack>
              )}

              {value?.type === 'quarter' && (
                <HStack>
                  <Select
                    placeholder="Année"
                    onChange={(e) => handleQuarterYearChange(e.target.value)}
                    value={value.value?.split('-')[0] || ''}
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Trimestre"
                    onChange={(e) => handleQuarterChange(e.target.value)}
                    value={value.value?.split('-')[1] || ''}
                  >
                    {QUARTERS.map((quarter) => (
                      <option key={quarter} value={quarter}>
                        {quarter}
                      </option>
                    ))}
                  </Select>
                </HStack>
              )}
            </VStack>
          );
        }}
      />
      <FormErrorMessage>
        {errors.releasePeriod && errors.releasePeriod.message}
      </FormErrorMessage>
    </FormControl>
  );
};
