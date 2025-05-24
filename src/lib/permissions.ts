import { Role, ArticleStatus } from '@prisma/client';

export const canAccessDashboard = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.EDITOR);
};

export const canEditGames = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.EDITOR);
};

export const canManageGames = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canViewAnnouncements = (role: Role): boolean => {
  return hasSufficientRole(role, Role.EDITOR);
};

export const canManageAnnouncements = (role: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canBroadcastNotifications = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.ADMIN);
};

export const roleHierarchy: Record<Role, number> = {
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

export const canCreateUsers = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canAssignRole = (currentRole: Role, targetRole: Role): boolean => {
  // SYSADMIN peut tout faire
  if (currentRole === Role.SYSADMIN) {
    return true;
  }

  // Les autres peuvent uniquement créer des rôles inférieurs
  const currentLevel = roleHierarchy[currentRole];
  const targetLevel = roleHierarchy[targetRole];
  return currentLevel > targetLevel;
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

  // Un EDITOR peut supprimer ses propres articles non publiés
  if (role === Role.EDITOR && article && userId) {
    return (
      article.userId === userId && article.status !== ArticleStatus.PUBLISHED
    );
  }

  return false;
};

export const canToggleUserStatus = (
  currentUserRole: Role,
  currentUserId: string,
  targetUser: { id: string; role: Role }
): boolean => {
  // Un utilisateur peut toujours désactiver son propre compte
  if (currentUserId === targetUser.id) {
    return true;
  }

  // SYSADMIN peut tout faire
  if (currentUserRole === Role.SYSADMIN) {
    return true;
  }

  // ADMIN ne peut pas désactiver d'autres ADMIN ou SYSADMIN
  if (currentUserRole === Role.ADMIN) {
    return !hasSufficientRole(targetUser.role, Role.ADMIN);
  }

  // Les autres ne peuvent pas désactiver d'autres comptes
  return false;
};

export const canAssignReviewer = (role?: Role): boolean => {
  return hasSufficientRole(role, Role.SENIOR_EDITOR);
};

export const canTransitionToStatus = (
  fromStatus: ArticleStatus,
  toStatus: ArticleStatus,
  role?: Role,
  article?: { userId: string; status: ArticleStatus },
  userId?: string
): boolean => {
  if (fromStatus === toStatus) {
    // Pas de transition si le statut est le même
    return true;
  }
  // Les ADMIN peuvent faire n'importe quelle transition
  if (hasSufficientRole(role, Role.ADMIN)) {
    return true;
  }

  // Cas spécial : suppression (peut être fait depuis n'importe quel statut)
  if (toStatus === 'DELETED') {
    // On vérifie directement les permissions de suppression
    return canDeleteArticles(
      role,
      { status: fromStatus, userId: article?.userId ?? '' },
      userId
    );
  }

  // Cas spécial : restauration depuis la corbeille
  if (fromStatus === 'DELETED') {
    // Seul un SENIOR_EDITOR ou plus peut restaurer
    return hasSufficientRole(role, Role.SENIOR_EDITOR);
  }

  // Pour les editors pour soumettre leurs articles
  if (fromStatus === 'DRAFT' && toStatus === 'PENDING_APPROVAL') {
    return hasSufficientRole(role, Role.EDITOR);
  }

  // Un EDITOR peut ramener son propre article en DRAFT
  if (toStatus === 'DRAFT') {
    return canEditArticle(
      role,
      article ? { status: fromStatus, userId: article.userId } : undefined,
      userId
    );
  }

  // Les autres transitions nécessitent des permissions de review
  if (!canReviewArticles(role)) return false;

  const transitions: Record<ArticleStatus, ArticleStatus[]> = {
    DRAFT: ['PENDING_APPROVAL', 'PUBLISHED'],
    PENDING_APPROVAL: ['PUBLISHED', 'NEEDS_CHANGES'],
    NEEDS_CHANGES: ['PENDING_APPROVAL', 'DRAFT'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: [],
    DELETED: [], // Pas de transition possible depuis DELETED (géré plus haut)
  };

  // Récupérer les transitions autorisées pour le statut actuel
  const allowedTransitions = transitions[fromStatus] || [];

  // Si la transition n'est pas dans la liste autorisée, retourner false
  if (!allowedTransitions.includes(toStatus)) return false;

  // Cas spécial publication
  if (toStatus === 'PUBLISHED' && !canPublishArticles(role)) return false;

  return true;
};
