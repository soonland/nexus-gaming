## 24 Apr 2025

### Navigation et Authentification

- Système d'inscription complet:

  - Formulaire d'inscription avec validation
  - Gestion des erreurs et états de chargement
  - Redirection après inscription vers login
  - Styles cohérents avec MUI

- Menu de navigation amélioré:

  - Menu admin avec contrôle d'accès par rôle
  - Affichage conditionnel des options selon le rôle
  - Boutons d'authentification dans la navbar
  - Support mobile avec drawer
  - Menu utilisateur avec avatar

- Sécurité et UX:
  - Redirection vers l'accueil après déconnexion
  - Validation des formulaires côté client
  - Gestion propre des états de chargement
  - Messages d'erreur contextuels

### Notification System Improvements

- Préférences de notification:
  - Alertes systèmes toujours actives in-app
  - Interface de préférences par type
  - Gestion des permissions de modification
  - Création automatique des préférences à l'inscription

#### API Endpoints

- `GET /api/notifications` - List all notifications with sorting (unread first)
- `PATCH /api/notifications/[id]` - Update a notification (mark as read)
- `POST /api/notifications/read-all` - Mark multiple notifications as read

#### Components

- **BaseNotificationBell**:

  - Reusable base component with bell icon and popover
  - Shows unread indicator with severity color
  - Individual "Mark as read" buttons with loading state
  - "Mark all as read" action with rotated bar chart icon
  - Visual distinction between read/unread notifications (opacity)

- **NotificationBell**:
  - Integration with password expiration notifications
  - Manages system notifications
  - Handles notification actions and loading states
  - Profile redirection for password notifications

#### Data Management

- `useNotifications` hook with TanStack Query:
  - Optimistic updates
  - Loading states per action
  - Proper error handling
  - Cache invalidation
  - Response typing

#### UX Improvements

- Loading spinners only on active notification actions
- Proper disabled states during actions
- Tooltips for clearer actions
- Sorted notifications (unread first, then by date)
- Visual feedback for read/unread state

## 25 Apr 2025

### Welcome Notifications

- Mise en place de notifications de bienvenue automatiques:

  - À l'inscription classique via register
  - À la création de compte par un admin
  - Type: SYSTEM_ALERT
  - Level: info
  - Message de bienvenue uniforme
  - Création dans une transaction avec l'utilisateur
  - Création simultanée des préférences de notifications

- Points techniques:
  - Transaction Prisma pour garantir l'atomicité des opérations
  - Cohérence entre les deux chemins de création (register et admin)
  - Intégration avec le système de notifications existant
  - Notification immédiatement visible dans l'interface

### API Testing Improvements

- Refactoring complet des tests API:

  - Meilleure structuration des mocks :
    ```typescript
    let findMany: ReturnType<typeof vi.fn>;
    beforeEach(() => {
      findMany = vi.fn(() => Promise.resolve(data));
      (prisma.model.findMany as any).mockImplementation(findMany);
    });
    ```
  - Tests précis des filtres Prisma :
    - Validation des conditions AND/OR
    - Test des préférences utilisateur
    - Vérification du tri et de la pagination

- Patterns de test améliorés :

  - Validation exacte des requêtes Prisma
  - Vérification des résultats retournés
  - Test des cas limites (filtres désactivés)
  - Meilleure couverture des erreurs
  - Réutilisation des données de test
  - Assertions plus précises

- Points techniques :
  - Utilisation des arrow functions pour les mocks
  - Organisation claire des données de test
  - Constants pour les filtres communs
  - Validation complète des réponses API
  - Test des conditions de sécurité

### User Management API Improvements

- Refonte de la gestion des permissions :

  - Nouvelles fonctions de permissions :

    ```typescript
    export const canCreateUsers = (role?: Role): boolean => {
      return hasSufficientRole(role, Role.SENIOR_EDITOR);
    };

    export const canAssignRole = (
      currentRole: Role,
      targetRole: Role
    ): boolean => {
      if (currentRole === Role.SYSADMIN) return true;
      return roleHierarchy[currentRole] > roleHierarchy[targetRole];
    };
    ```

  - Séparation claire des responsabilités :
    - Vérification d'accès à l'API
    - Vérification des permissions de création
    - Validation des attributions de rôle
  - Gestion spéciale pour SYSADMIN

- Tests exhaustifs de l'API users :

  - Tests de pagination :

    - Validation des paramètres page/limit
    - Gestion des valeurs négatives et extrêmes
    - Calcul correct du nombre de pages
    - Limitation automatique à 100 résultats

  - Tests de recherche et filtres :

    - Recherche insensible à la casse
    - Recherche sur username et email
    - Filtres par rôle avec validation
    - Filtres par statut (actif/inactif)
    - Combinaison de plusieurs critères
    - Validation des requêtes Prisma générées

  - Tests de contrôle d'accès :

    - Refus pour utilisateurs non autorisés
    - Vérification par niveau hiérarchique
    - Tests de création par rôle
    - Validation des restrictions de rôle

  - Tests de validation et erreurs :
    - Validation des champs requis
    - Format d'email invalide
    - Doublons username/email
    - Erreurs de base de données
    - Échecs de transaction
    - Messages d'erreur appropriés
