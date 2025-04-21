'use client';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminForm } from '@/components/admin';
import { useNotifier } from '@/components/common/Notifier';
import { useAuth } from '@/hooks/useAuth';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';

import { AVAILABLE_ROLES, ROLE_STYLES, isRoleManageable } from './userStyles';

interface IUserFormProps {
  initialData?: {
    id: string;
    username: string;
    email: string;
    role: Role;
    isActive: boolean;
  };
  mode: 'create' | 'edit';
}

export const UserForm = ({ initialData, mode }: IUserFormProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [username, setUsername] = useState(initialData?.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [email, setEmail] = useState(initialData?.email || '');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState<Role>(initialData?.role || 'USER');
  const [roleError, setRoleError] = useState('');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser(initialData?.id || '');
  const { showSuccess, showError } = useNotifier();

  const availableRoles = AVAILABLE_ROLES.filter(
    role => currentUser && isRoleManageable(currentUser.role, role, mode)
  );

  const validateForm = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Le nom d'utilisateur est requis");
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError(
        "Le nom d'utilisateur doit contenir au moins 3 caractères"
      );
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!email.trim()) {
      setEmailError("L'adresse email est requise");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("L'adresse email n'est pas valide");
      isValid = false;
    } else {
      setEmailError('');
    }

    if (mode === 'create' && !password.trim()) {
      setPasswordError('Le mot de passe est requis');
      isValid = false;
    } else if (password && password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!availableRoles.includes(role)) {
      setRoleError('Rôle non autorisé');
      isValid = false;
    } else {
      setRoleError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createUser.mutateAsync({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(), // obligatoire pour la création
          role,
          isActive,
        });
        showSuccess('Utilisateur créé avec succès');
      } else if (initialData?.id) {
        await updateUser.mutateAsync({
          username: username.trim(),
          email: email.trim(),
          role,
          isActive,
          ...(password.trim() ? { password: password.trim() } : {}),
        });
        showSuccess('Utilisateur modifié avec succès');
      }

      router.push('/admin/users');
      router.refresh();
    } catch (error) {
      console.error('Error saving user:', error);
      showError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      cancelHref='/admin/users'
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          autoFocus
          fullWidth
          required
          error={!!usernameError}
          helperText={usernameError}
          label="Nom d'utilisateur"
          name='username'
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError('');
          }}
        />
        <TextField
          fullWidth
          required
          error={!!emailError}
          helperText={emailError}
          label='Email'
          name='email'
          type='email'
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
        />
        <TextField
          fullWidth
          error={!!passwordError}
          helperText={
            passwordError ||
            (mode === 'edit' &&
              'Laissez vide pour conserver le mot de passe actuel')
          }
          label='Mot de passe'
          name='password'
          required={mode === 'create'}
          type='password'
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
        />
        <FormControl fullWidth error={!!roleError}>
          <InputLabel id='role-label'>Rôle</InputLabel>
          <Select
            required
            label='Rôle'
            labelId='role-label'
            name='role'
            value={role}
            onChange={e => {
              setRole(e.target.value as Role);
              if (roleError) setRoleError('');
            }}
          >
            {availableRoles.map(role => (
              <MenuItem key={role} value={role}>
                {ROLE_STYLES[role].label}
              </MenuItem>
            ))}
          </Select>
          {roleError && <FormHelperText>{roleError}</FormHelperText>}
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
            />
          }
          label='Compte actif'
        />
      </Stack>
    </AdminForm>
  );
};
