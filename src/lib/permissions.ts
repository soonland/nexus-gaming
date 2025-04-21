import { Role } from '@prisma/client';

export const canManageAnnouncements = (role?: Role): boolean => {
  return role === Role.ADMIN || role === Role.SYSADMIN;
};

export const canSelectArticleAuthor = (role?: Role): boolean => {
  return (
    role === Role.MODERATOR || role === Role.ADMIN || role === Role.SYSADMIN
  );
};
