import type { AnnouncementType } from '@prisma/client';

import type { ActiveStatus } from '@/hooks/useAdminAnnouncement';

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
  ActiveStatus,
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

export const getAnnouncementTypeStyle = (type: AnnouncementType) =>
  TYPE_STYLES[type];

export const getStatusStyle = (status: ActiveStatus) => STATUS_STYLES[status];
