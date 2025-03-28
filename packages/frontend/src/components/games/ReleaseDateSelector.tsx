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
import { Control, Controller } from 'react-hook-form';
import { GameFormData } from '@/types/game';

interface ReleaseDateSelectorProps {
  control: Control<GameFormData>;
  errors: {
    releaseDate?: {
      message?: string;
    };
  };
}

// Format: Jan => 01, Feb => 02, etc.
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const getCurrentYear = () => new Date().getFullYear();
const YEARS = Array.from(
  { length: getCurrentYear() + 3 - 2000 + 1 },
  (_, i) => 2000 + i
);

const parseDateValue = (value: string | undefined) => {
  if (!value) return { type: 'none', date: '' };
  if (value.includes('-Q')) return { type: 'quarter', date: value };
  if (value.length === 7) return { type: 'month', date: value };
  if (value.length === 10) return { type: 'date', date: value };
  return { type: 'none', date: '' };
};

export const ReleaseDateSelector = ({
  control,
  errors,
}: ReleaseDateSelectorProps) => {
  return (
    <FormControl isInvalid={!!errors.releaseDate}>
      <FormLabel>Date de sortie</FormLabel>
      <Controller
        name="releaseDate"
        control={control}
        render={({ field: { onChange, value } }) => {
          const { type, date } = parseDateValue(value);

          const handleTypeChange = (newType: string) => {
            if (newType === 'none') {
              onChange(undefined);
              return;
            }
            const year = getCurrentYear().toString();
            switch (newType) {
              case 'date':
                onChange(`${year}-01-01`);
                break;
              case 'month':
                onChange(`${year}-01`);
                break;
              case 'quarter':
                onChange(`${year}-Q1`);
                break;
            }
          };

          const handleDateChange = (newValue: string) => {
            onChange(newValue);
          };

          const handleMonthChange = (newMonth: string) => {
            const year = date?.split('-')[0] || getCurrentYear();
            onChange(`${year}-${newMonth}`);
          };

          const handleYearChange = (newYear: string) => {
            if (type === 'month') {
              const month = date?.split('-')[1] || '01';
              onChange(`${newYear}-${month}`);
            } else if (type === 'quarter') {
              const quarter = date?.split('-')[1] || 'Q1';
              onChange(`${newYear}-${quarter}`);
            }
          };

          const handleQuarterChange = (newQuarter: string) => {
            const year = date?.split('-')[0] || getCurrentYear();
            onChange(`${year}-${newQuarter}`);
          };

          return (
            <VStack align="stretch" spacing={4}>
              <RadioGroup onChange={handleTypeChange} value={type}>
                <VStack align="start" spacing={2}>
                  <Radio value="none">Date non définie</Radio>
                  <Radio value="date">Date précise</Radio>
                  <Radio value="month">Mois</Radio>
                  <Radio value="quarter">Trimestre</Radio>
                </VStack>
              </RadioGroup>

              {type === 'date' && (
                <Input
                  type="date"
                  onChange={(e) => handleDateChange(e.target.value)}
                  value={date}
                />
              )}

              {type === 'month' && (
                <HStack>
                  <Select
                    placeholder="Année"
                    onChange={(e) => handleYearChange(e.target.value)}
                    value={date?.split('-')[0] || ''}
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
                    value={date?.split('-')[1] || ''}
                  >
                    {MONTHS.map((month, index) => {
                      const monthNumber = (index + 1).toString().padStart(2, '0');
                      return (
                        <option key={month} value={monthNumber}>
                          {month}
                        </option>
                      );
                    })}
                  </Select>
                </HStack>
              )}

              {type === 'quarter' && (
                <HStack>
                  <Select
                    placeholder="Année"
                    onChange={(e) => handleYearChange(e.target.value)}
                    value={date?.split('-')[0] || ''}
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
                    value={date?.split('-')[1] || ''}
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
        {errors.releaseDate && errors.releaseDate.message}
      </FormErrorMessage>
    </FormControl>
  );
};
