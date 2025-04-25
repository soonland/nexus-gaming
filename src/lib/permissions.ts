import { Role, ArticleStatus } from '@prisma/client';

export const canViewAnnouncements = (role: Role): boolean => {
  return hasSufficientRole(role, Role.EDITOR);
};

export const canManageAnnouncements = (role: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canBroadcastNotifications = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.ADMIN);
};

const roleHierarchy: Record<Role, number> = {
  USER: 1,
  MODERATOR: 2,
  EDITOR: 3,
  SENIOR_EDITOR: 4,
  ADMIN: 5,
  SYSADMIN: 6,
};

export const hasSufficientRole = (
  userRole?: Role,
  requiredRole?: Role,
  operator: '>' | '<' | '=' | '>=' | '<=' = '>='
): boolean => {
  if (!userRole || !requiredRole) return false;
  const userLevel = roleHierarchy[userRole];
  const requiredLevel = roleHierarchy[requiredRole];

  const comparisons = {
    '>': userLevel > requiredLevel,
    '<': userLevel < requiredLevel,
    '=': userLevel === requiredLevel,
    '>=': userLevel >= requiredLevel,
    '<=': userLevel <= requiredLevel,
  };

  return comparisons[operator] ?? false;
};

export const canViewArticle = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.EDITOR);
};

export const canViewApprovalHistory = (
  role?: Role,
  article?: { userId: string },
  userId?: string
): boolean => {
  // SENIOR_EDITOR+ peuvent voir l'historique de tous les articles
  if (hasSufficientRole(role, Role.SENIOR_EDITOR)) {
    return true;
  }

  // L'auteur peut voir l'historique de ses propres articles
  if (article && userId) {
    return article.userId === userId;
  }

  return false;
};

export const canSelectArticleAuthor = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canReviewArticles = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canPublishArticles = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canEditArticle = (
  role?: Role,
  article?: { status: ArticleStatus; userId: string },
  userId?: string
): boolean => {
  // SENIOR_EDITOR+ peuvent modifier n'importe quel article
  if (hasSufficientRole(role, Role.SENIOR_EDITOR)) {
    return true;
  }

  // Un EDITOR ne peut modifier que ses propres articles non publiés
  if (role === Role.EDITOR && article && userId) {
    return (
      article.userId === userId && article.status !== ArticleStatus.PUBLISHED
    );
  }

  return false;
};

export const canDeleteArticles = (
  role?: Role,
  article?: { status: ArticleStatus; userId: string },
  userId?: string
): boolean => {
  // SENIOR_EDITOR et plus peuvent supprimer n'importe quel article
  if (hasSufficientRole(role, Role.SENIOR_EDITOR)) {
    return true;
  }

  // Si l'article et l'userId sont fournis
  if (article && userId) {
    // L'utilisateur peut supprimer ses propres articles en DRAFT
    return article.status === ArticleStatus.DRAFT && article.userId === userId;
  }

  return false;
};

export const canAssignReviewer = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canTransitionToStatus = (
  fromStatus: ArticleStatus,
  toStatus: ArticleStatus,
  role?: Role
): boolean => {
  // For editors to submit their articles
  if (fromStatus === 'DRAFT' && toStatus === 'PENDING_APPROVAL') {
    return hasSufficientRole(role, Role.EDITOR);
  }

  // Other transitions require review permissions
  if (!canReviewArticles(role)) return false;

  const transitions: Record<ArticleStatus, ArticleStatus[]> = {
    DRAFT: ['PENDING_APPROVAL', 'PUBLISHED'], // Allow direct publishing from DRAFT
    PENDING_APPROVAL: ['PUBLISHED', 'NEEDS_CHANGES'],
    NEEDS_CHANGES: ['PENDING_APPROVAL'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: [],
    DELETED: [], // No transitions allowed from DELETED
  };

  // Get allowed transitions for current status
  const allowedTransitions = transitions[fromStatus] || [];

  // If transition is not in allowed list, return false
  if (!allowedTransitions.includes(toStatus)) return false;

  // Special cases
  if (toStatus === 'PUBLISHED' && !canPublishArticles(role)) return false;
  if (toStatus === 'DELETED' && !canDeleteArticles(role)) return false;

  return true;
};
