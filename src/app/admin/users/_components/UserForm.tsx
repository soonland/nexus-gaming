'use client'

import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Select,
  FormErrorMessage,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Role } from '@prisma/client'

interface UserFormData {
  username: string
  email: string
  password?: string
  role: Role
}

interface UserFormProps {
  initialData?: Omit<UserFormData, 'password'>
  onSubmit: (data: UserFormData) => Promise<void>
  isLoading: boolean
}

export default function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const router = useRouter()
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})
  const [formData, setFormData] = useState<UserFormData>({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || Role.USER,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when field is modified
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {}

    if (!formData.username) {
      newErrors.username = 'Username is required'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!initialData && !formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // Only include password in the submission if it's provided
      const dataToSubmit = {
        ...formData,
        password: formData.password || undefined,
      }
      
      await onSubmit(dataToSubmit)
      router.push('/admin/users')
    } catch (error) {
      console.error('Form submission error:', error)
      // Handle error (you might want to show a toast notification)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired={!initialData} isInvalid={!!errors.password}>
          <FormLabel>{initialData ? 'New Password (optional)' : 'Password'}</FormLabel>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Role</FormLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value={Role.USER}>User</option>
            <option value={Role.EDITOR}>Editor</option>
            <option value={Role.MODERATOR}>Moderator</option>
            <option value={Role.ADMIN}>Admin</option>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={4} justify="flex-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
          >
            {initialData ? 'Update' : 'Create'} User
          </Button>
        </Stack>
      </VStack>
    </form>
  )
}
