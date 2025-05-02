# Technical Context

## Architecture Patterns

### Next.js App Router

L'application utilise le nouveau App Router de Next.js 13+, avec une
organisation claire des fichiers:

```
src/
  app/              # Routes et pages
    (auth)/         # Routes protégées
    api/           # API routes
  components/      # Composants React réutilisables
  hooks/          # Custom hooks React
  lib/            # Utilitaires et services
  types/          # Types TypeScript
```

### API Design

Les endpoints API suivent une structure REST classique, avec quelques
adaptations pour Next.js :

```typescript
// Route handler moderne avec API route handlers de Next.js 13+
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  // ...
  return NextResponse.json({ data });
}
```

### Prisma ORM

Prisma est utilisé comme ORM avec une configuration adaptée au projet:

- Schema descriptif dans `prisma/schema.prisma`
- Migrations versionnées dans `prisma/migrations`
- Client généré avec types TypeScript
- Helpers custom pour transactions et relations

## Conventions de Code

### TypeScript

- Utilisation strict des types avec `strict: true`
- Interfaces préfixées par `I` (ex: `IUserData`)
- Types utilitaires dans des fichiers dédiés
- Extensions de type pour les props de composants

#### Patterns de Typage

1. Types de Base vs Types Étendus :

```typescript
// Type de base pour les données minimales
interface IArticleBasicData {
  id: string;
  title: string;
  content: string;
  heroImage?: string | null;
}

// Type complet avec toutes les données
interface IArticleData extends IArticleBasicData {
  category: ICategoryData;
  user: IUserBasicData;
  // ...
}
```

2. Gestion des Dates :

```typescript
// Dates sous forme de chaînes ISO dans les interfaces
interface IEntityData {
  createdAt: string; // Format ISO
  updatedAt: string; // Format ISO
  publishedAt?: string; // Format ISO ou undefined
}

// Conversion aux points d'entrée/sortie
const formatEntity = (raw: RawEntity): IEntityData => ({
  ...raw,
  createdAt: dayjs(raw.createdAt).format(),
  updatedAt: dayjs(raw.updatedAt).format(),
});
```

3. Gestion des Champs Optionnels :

```typescript
// Préférer undefined à null pour les champs optionnels dans les interfaces
interface IFormData {
  title: string;
  description?: string; // undefined si non défini
  heroImage?: string; // undefined si non défini
}

// Utiliser null pour les champs DB nullable
interface IDBEntity {
  title: string;
  description: string | null; // null en DB
  heroImage: string | null; // null en DB
}
```

4. Types Partiels et Utilitaires :

```typescript
// Types pour les formulaires
type ArticleForm = Partial<IArticleData>;

// Types pour les mises à jour
type ArticleUpdate = {
  id: string;
  data: Partial<IArticleData>;
};
```

### React Patterns

- Hooks custom pour la logique réutilisable
- Props fortement typées avec TypeScript
- Composants atomiques dans `/components/common`
- Tests unitaires avec Vitest

### Gestion d'État

- React Query pour les données serveur
- État local avec useState/useReducer
- Context pour l'état global limité (auth, theme)

### Tests

- Tests unitaires : Vitest + React Testing Library
- Tests API : Vitest + Supertest
- Tests E2E : Playwright

## Outils

### Développement

- pnpm comme gestionnaire de paquets
- ESLint pour le linting
- Prettier pour le formatage
- Husky pour les hooks git

### CI/CD

- GitHub Actions pour :
  - Tests
  - Lint
  - Build
  - Preview deployments
  - Production deployments

### Monitoring

- Sentry pour le tracking d'erreurs
- Custom logging pour les events importants
- Métriques de performance avec Vercel

## Sécurité

### Authentication

- NextAuth.js pour l'auth
- JWT pour les sessions
- Middleware de protection des routes
- RBAC pour les permissions

### API Security

- Rate limiting
- CORS configuration
- Input validation
- Error handling sécurisé

## Performance

### Optimisations Frontend

- Code splitting automatique
- Image optimization
- Prefetching intelligent
- Caching approprié

### Optimisations Backend

- Query caching avec React Query
- Optimistic updates
- Debouncing/throttling
