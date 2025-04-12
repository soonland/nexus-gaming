# Nexus Gaming

Plateforme de gestion de fiches de jeux vidéo avec critiques et articles.

## Technologies

- Next.js 15
- TypeScript
- Prisma (PostgreSQL)
- Chakra UI
- TanStack Query
- JWT Authentication

## Configuration requise

- Node.js v20+
- PostgreSQL 15+
- Docker (optionnel)

## Installation

1. Cloner le dépôt :

```bash
git clone <repository-url>
cd nexus-gaming
```

2. Installer les dépendances :

```bash
cd nexus-gaming-next
npm install
```

3. Configuration des variables d'environnement :

```bash
cp .env.example .env
# Modifier les variables selon votre environnement
```

4. Initialiser la base de données :

```bash
npx prisma migrate dev
```

## Démarrage

### Avec Docker :

```bash
docker-compose up
```

### Sans Docker :

```bash
npm run dev
```

L'application sera accessible à :

- http://localhost:3000

## Structure du projet

```
nexus-gaming/
└── nexus-gaming-next/
    ├── prisma/          # Configuration Prisma et migrations
    ├── public/          # Fichiers statiques
    └── src/
        ├── app/         # Routes et pages Next.js
        ├── components/  # Composants React
        ├── hooks/       # Hooks personnalisés
        ├── lib/         # Utilitaires et configurations
        ├── providers/   # Providers React
        └── types/       # Types TypeScript
```

## Fonctionnalités

- Gestion des jeux vidéo (CRUD)
- Système de critiques avec notes
- Rédaction d'articles
- Association d'articles aux jeux
- Authentification utilisateur
- Gestion des rôles (User/Admin)
- Interface responsive avec thème clair/sombre

## Scripts disponibles

- `npm run dev` : Démarre l'application en mode développement
- `npm run build` : Compile l'application pour la production
- `npm run start` : Démarre l'application en mode production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run db:clean` : Nettoie la base de données (développement)

## Contribution

1. Créer une branche pour votre fonctionnalité
2. Commiter vos changements
3. Pousser la branche
4. Créer une Pull Request

## Licence

MIT
