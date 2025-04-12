'use client';

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator';
import { useAuth } from '@/hooks/useAuth';

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: Role;
}

interface UserFormProps {
  initialData?: Omit<UserFormData, 'password'> & { id?: string };
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading: boolean;
}

export default function UserForm({
  initialData,
  onSubmit,
  isLoading,
}: UserFormProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});
  const [formData, setFormData] = useState<UserFormData>({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    confirmPassword: '',
    role: initialData?.role || Role.USER,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear current field error
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));

    // Real-time password match validation
    if (name === 'password' || name === 'confirmPassword') {
      const otherValue =
        name === 'password' ? formData.confirmPassword : formData.password;

      if (value && otherValue && value !== otherValue) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: undefined,
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!initialData && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Only include password in the submission if it's provided
      const dataToSubmit = {
        ...formData,
        password: formData.password || undefined,
      };

      await onSubmit(dataToSubmit);
      router.push('/admin/users');
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (you might want to show a toast notification)
    }
  };

  return (
    <Box as='form' onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            name='username'
            value={formData.username}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password} isRequired={!initialData}>
          <FormLabel>
            {initialData ? 'New Password (optional)' : 'Password'}
          </FormLabel>
          <Input
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
          {formData.password && (
            <PasswordStrengthIndicator password={formData.password} />
          )}
        </FormControl>

        <FormControl
          isInvalid={!!errors.confirmPassword}
          isRequired={!initialData && !!formData.password}
        >
          <FormLabel>Confirm Password</FormLabel>
          <Input
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Role</FormLabel>
          <Select
            isDisabled={
              (initialData?.role === 'SYSADMIN' &&
                currentUser?.role !== 'SYSADMIN') ||
              initialData?.id === currentUser?.id
            }
            name='role'
            value={formData.role}
            onChange={handleChange}
          >
            <option value={Role.USER}>User</option>
            <option value={Role.EDITOR}>Editor</option>
            <option value={Role.MODERATOR}>Moderator</option>
            <option value={Role.ADMIN}>Admin</option>
            {currentUser?.role === 'SYSADMIN' && (
              <option value={Role.SYSADMIN}>System Admin</option>
            )}
          </Select>
        </FormControl>

        <Stack direction='row' justify='flex-end' spacing={4}>
          <Button
            isDisabled={isLoading}
            variant='outline'
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button colorScheme='blue' isLoading={isLoading} type='submit'>
            {initialData ? 'Update' : 'Create'} User
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
