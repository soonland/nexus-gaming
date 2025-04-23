# System Patterns: Nexus Gaming News

## Interface Patterns

### Navigation

```mermaid
graph TD
    A[App Layout] --> B[Navigation]
    A --> C[Content Area]

    B --> D[Auth Components]
    B --> E[User Menu]

    C --> F[Article Management]
    C --> G[Game Management]
    C --> H[User Management]
    C --> I[Platform Management]
```

### Article Management

```mermaid
graph TD
    A[Article Management] --> B[List View]
    A --> C[Edit Form]
    A --> D[Status Management]

    B --> E[Filter/Search]
    B --> F[Batch Actions]
    B --> G[Sorting]

    C --> H[Content Editor]
    C --> I[Metadata Panel]
    C --> J[Media Upload]

    D --> K[Status Transitions]
    D --> L[Review Process]
    D --> M[History]
```

### Data Table Patterns

```mermaid
graph TD
    A[AdminDataTable] --> B[Header Controls]
    A --> C[Table Content]

    B --> D[Left Section]
    B --> E[Right Section]

    D --> F[Selection Management]
    D --> G[Batch Actions]

    E --> H[Page Info]
    E --> I[Navigation]
    E --> J[Page Size]
```

### Batch Operations

```mermaid
graph TD
    A[Batch Actions] --> B[Selection Management]
    B --> C[Individual Select]
    B --> D[Select All]
    B --> E[Clear Selection]

    A --> F[Status Updates]
    F --> G[Publish Selected]
    F --> H[Unpublish Selected]
    F --> I[Delete Selected]
```

## Authorization Patterns

### Role Hierarchy

```mermaid
graph TD
    A[SYSADMIN] --> B[ADMIN]
    B --> C[SENIOR_EDITOR]
    C --> D[EDITOR]
    D --> E[MODERATOR]
    E --> F[USER]
```

### Article Permissions

```mermaid
graph TD
    A[Article Access] --> B[View]
    A --> C[Create]
    A --> D[Edit]
    A --> E[Delete]

    D --> F{Owner Check}
    F --> G[Own Content]
    F --> H[Others Content]

    E --> I{Delete Rules}
    I --> J[SENIOR_EDITOR: Any]
    I --> K[USER: Own Drafts]
```

### Status Transitions

```mermaid
graph TD
    A[DRAFT] --> B[PENDING_APPROVAL]
    B --> C[PUBLISHED]
    B --> D[NEEDS_CHANGES]
    D --> B
    C --> E[ARCHIVED]

    subgraph Permissions
        F[SENIOR_EDITOR+] --> G[All Transitions]
        H[EDITOR] --> I[Draft to Pending]
        J[Own Draft] --> K[Delete]
    end
```

## Implementation Patterns

### Generic Components

#### Data Table

- Type-safe props et events
- Configuration flexible des colonnes
- Fonctions de rendu personnalisables
- Gestion intégrée de la sélection
- Actions par lot
- Organisation de l'en-tête :
  - Gauche : Info sélection et actions
  - Droite : Pagination et contrôles

#### Selection Management

- Sélection individuelle
- Contrôles de sélection en masse
- Persistance de l'état de sélection
- Gestion des ID typée
- Affichage du nombre de sélections
- Mise en page optimisée :
  - Hauteur d'en-tête constante
  - Transitions fluides
  - Hiérarchie visuelle claire
  - Affichage contextuel des actions

### State Management

#### Article States

- Statut de l'article
- État de la sélection
- État des actions en cours
- État des permissions

#### Batch Operations

- Interface de sélection multiple
- Contrôles d'actions en lot
- Retour de progression
- Gestion des erreurs
- Synchronisation d'état

### Validation

#### Permission Checks

- Vérification du rôle
- Vérification de propriété
- Règles de transition d'état
- Validation des actions en lot

#### Data Validation

- Champs requis
- Validation de format
- Validation métier
- Gestion des erreurs

### User Feedback

#### Visual Feedback

- États de chargement
- Transitions d'état
- Indicateurs de progression
- Messages d'erreur

#### Action Feedback

- Messages de succès/erreur
- Confirmations d'action
- Notifications de changement d'état
- Retour d'action par lot
