import type { Role } from '@prisma/client';

import { hasSufficientRole } from '@/lib/permissions';

export const ROLE_STYLES: Record<
  Role,
  {
    label: string;
    color: string;
    backgroundColor: string;
    borderWidth: number;
  }
> = {
  USER: {
    label: 'Utilisateur',
    color: 'rgb(13, 60, 97)',
    backgroundColor: 'rgb(231, 246, 255)',
    borderWidth: 4,
  },
  MODERATOR: {
    label: 'Modérateur',
    color: 'rgb(102, 60, 0)',
    backgroundColor: 'rgb(255, 244, 229)',
    borderWidth: 4,
  },
  EDITOR: {
    label: 'Éditeur',
    color: 'rgb(0, 105, 92)',
    backgroundColor: 'rgb(232, 245, 233)',
    borderWidth: 4,
  },
  SENIOR_EDITOR: {
    label: 'Éditeur senior',
    color: 'rgb(0, 105, 92)',
    backgroundColor: 'rgb(232, 245, 233)',
    borderWidth: 4,
  },
  ADMIN: {
    label: 'Administrateur',
    color: 'rgb(122, 12, 46)',
    backgroundColor: 'rgb(255, 231, 237)',
    borderWidth: 4,
  },
  SYSADMIN: {
    label: 'Super Admin',
    color: 'rgb(66, 33, 99)',
    backgroundColor: 'rgb(237, 231, 246)',
    borderWidth: 6,
  },
};

export const STATUS_STYLES: Record<
  'active' | 'inactive',
  {
    label: string;
    color: string;
    backgroundColor: string;
  }
> = {
  active: {
    label: 'Actif',
    color: 'rgb(27, 94, 32)',
    backgroundColor: 'rgb(237, 247, 237)',
  },
  inactive: {
    label: 'Inactif',
    color: 'rgb(95, 95, 95)',
    backgroundColor: 'rgb(242, 242, 242)',
  },
};

export const getRoleStyle = (role: Role) => ROLE_STYLES[role];

export const getStatusStyle = (isActive: boolean) =>
  STATUS_STYLES[isActive ? 'active' : 'inactive'];

export const isRoleManageable = (userRole: Role, targetRole: Role): boolean => {
  // SYSADMIN peut tout faire
  if (userRole === 'SYSADMIN') return true;

  // En création ou édition, on ne peut pas gérer un rôle supérieur ou égal
  return hasSufficientRole(userRole, targetRole, '>');
};

export const AVAILABLE_ROLES = Object.keys(ROLE_STYLES) as Role[];
