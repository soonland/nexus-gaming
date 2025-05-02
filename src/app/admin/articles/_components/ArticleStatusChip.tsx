import { Chip } from '@mui/material';
import type { ArticleStatus } from '@prisma/client';

interface IArticleStatusChipProps {
  status: ArticleStatus;
}

const statusConfig: Record<
  ArticleStatus,
  {
    color: 'default' | 'primary' | 'success' | 'warning' | 'error';
    label: string;
  }
> = {
  ARCHIVED: { color: 'primary', label: 'Archivé' },
  DELETED: { color: 'error', label: 'Supprimé' },
  DRAFT: { color: 'default', label: 'Brouillon' },
  NEEDS_CHANGES: { color: 'error', label: 'À réviser' },
  PENDING_APPROVAL: { color: 'warning', label: 'En attente' },
  PUBLISHED: { color: 'success', label: 'Publié' },
};

export const ArticleStatusChip = ({ status }: IArticleStatusChipProps) => {
  const config = statusConfig[status];

  return <Chip color={config.color} label={config.label} size='small' />;
};
