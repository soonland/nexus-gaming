import type { AnnouncementType } from '@prisma/client';

import type { ArticleStatus } from '@/types/api';

export const TYPE_STYLES: Record<
  AnnouncementType,
  {
    label: string;
    color: string;
    backgroundColor: string;
    borderWidth: number;
  }
> = {
  INFO: {
    label: 'Information',
    color: 'rgb(30, 73, 118)',
    backgroundColor: 'rgb(229, 246, 253)',
    borderWidth: 4,
  },
  ATTENTION: {
    label: 'Attention',
    color: 'rgb(102, 60, 0)',
    backgroundColor: 'rgb(255, 244, 229)',
    borderWidth: 4,
  },
  URGENT: {
    label: 'Urgent',
    color: 'rgb(122, 12, 46)',
    backgroundColor: 'rgb(255, 231, 237)',
    borderWidth: 6,
  },
};

export const STATUS_STYLES: Record<
  ArticleStatus,
  {
    label: string;
    color: string;
    backgroundColor: string;
  }
> = {
  DRAFT: {
    label: 'Brouillon',
    color: 'rgb(30, 73, 118)',
    backgroundColor: 'rgb(229, 246, 253)',
  },
  PENDING_APPROVAL: {
    label: "En attente d'approbation",
    color: 'rgb(102, 60, 0)',
    backgroundColor: 'rgb(255, 244, 229)',
  },
  PUBLISHED: {
    label: 'Publié',
    color: 'rgb(22, 163, 74)',
    backgroundColor: 'rgb(220, 252, 231)',
  },
  ARCHIVED: {
    label: 'Archivé',
    color: 'rgb(156, 163, 175)',
    backgroundColor: 'rgb(241, 245, 249)',
  },
};

export const getStatusStyle = (status: ArticleStatus) => {
  return (
    STATUS_STYLES[status] ?? {
      label: status,
      color: 'rgb(30, 73, 118)',
      backgroundColor: 'rgb(229, 246, 253)',
    }
  );
};
